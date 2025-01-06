var express = require('express')
var router = express.Router()
require('dotenv').config()


/************************************** MySQL CRUD **************************************/
const pool = require('../connDB.js')
const bcrypt = require('bcrypt')
//  GET(조회), POST(입력), PUT(수정), DELETE(삭제)

// sql쿼리 요청 방법은 2가지가 있습니다.
// pool.query(sql, params)   : 매번 새 SQL 파싱하므로 비교적 느림
// pool.execute(sql, params) : Prepared Statement 재사용으로 비교적 빠름(추천)

// execute 함수는 아래와 같이 구성되어 있으며, rows와 fields를 반환합니다.

// sample) const [rows, fields] = await pool.execute(sql, [params]);
// rows는 쿼리 실행결과로 반환된 데이터의 배열입니다.
// fields는 실행결과에 대한 메타데이터를 포함하는 배열입니다.

// 비밀번호 해시화 함수
async function hashPwd(password) {
    const saltRounds = 10; // 해시 반복 횟수
    const hashedPwd = await bcrypt.hash(password, saltRounds);
    return hashedPwd;
}

// 비밀번호 비교 함수
async function comparePwd(inputPwd, storedHashedPwd) {
    const match = await bcrypt.compare(inputPwd, storedHashedPwd);
    return match; // true 또는 false 반환
}


/******************************** 일반 회원가입 및 로그인 ********************************/
// 회원가입 : 유틸리티 함수
const signupUtil = async (memInfo) => {
    // 클라이언트로부터 받은 데이터
    const { name, email, pwd, phone, img_url, member_type_id, address } = memInfo;

    // 비동기 처리된 함수 선언 시, await을 붙이는 이유는
    // promise가 해결된 후의 값을 반환받기 위해서 입니다.
    let pwdHash = await hashPwd(pwd)
    const sql = `insert into member (name, email, pwd, phone, eco_point, image_url, member_type_id, subs_id, address)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?)`

    const values = [name, email, pwdHash, phone || null, 100, img_url, member_type_id, 1, address || null]
    const [result] = await pool.execute(sql, values)
    return result
}

// 로그인 : 유틸리티 함수
const loginUtil = async (loginInfo) => {
    const { loginEmail, loginPwd } = loginInfo
    const sql = 'select * from member where email = ?'
    
    const [rows] = await pool.execute(sql, [loginEmail])
    if (rows.length === 0) {
        return false; // 사용자 없음
    }
    const match = await comparePwd(loginPwd, rows[0].pwd)
    return match
}
/******************************** 일반 회원가입 및 로그인 ********************************/
// 회원가입 : member data DB에 추가 + 비밀번호 해시
router.post('/memberInsert', async (req, res) => {
    try {
        const result = await signupUtil(req.body)
        res.status(201).json({ message: '회원가입 성공', memId: result.insertId })
    } catch (error) {
        console.error("signupHandler 오류: ", error)
        res.status(500).json({ message: "서버오류" })
    }
})

// 로그인 : 회원 이메일 및 비밀번호 해시값 비교
router.post('/memberLogin', async (req, res) => {
    try {
        const match = await loginUtil(req.body)
        if (match) {
            req.session.user = {
                email: req.body.loginEmail,
                isAuthenticated: true,
            }
            res.status(200).json({ message: '로그인 성공', result: match })
        } else {
            res.status(401).json({ message: '계정이 일치하지 않습니다.', result: match})
        }

    } catch (error) {
        console.error("memberLogin 오류: ", error);
        res.status(500).json({ message: "서버오류" })
    }
})
/******************************** 일반 회원가입 및 로그인 ********************************/



/********************************** 회원정보 찾기 및 수정 **********************************/
// 이메일 찾기
router.post('/findEmail', async (req, res) => {
    const { name, phone } = req.body

    try {
        sql = "select email from member where name = ? and phone = ?"
        const [rows] = await pool.execute(sql, [name, phone])
        res.status(201).json({ message: '이메일 찾기 성공', result: rows })
    } catch (error) {
        console.error("이메일 찾기 오류: ", error);
        res.status(500).json({ message: "서버오류" })
    }
})

// 비밀번호 재설정
router.put('/resetPwd', async (req, res) => {
    const { email, pwd, name, phone } = req.body;

    try {
        // 입력 값 검증
        if (!email || !pwd || !name || !phone) {
            return res.status(400).json({ message: "모든 필드를 입력해주세요." });
        }

        // 비밀번호 암호화
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(pwd, 10);

        // 데이터베이스 업데이트
        const sql = "UPDATE member SET pwd = ? WHERE email = ? AND name = ? AND phone = ?";
        const [rows] = await pool.execute(sql, [hashedPassword, email, name, phone]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: "일치하는 회원 정보를 찾을 수 없습니다." });
        }

        res.status(200).json({ message: "비밀번호 재설정에 성공했습니다." });
    } catch (error) {
        console.error("비밀번호 재설정 오류: ", error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});
/********************************** 회원정보 찾기 및 수정 **********************************/


/************************************* Google OAuth2 *************************************/
// 로그인 버튼을 누르면 도착하는 목적지 라우터
// https://accounts.google.com/o/oauth2/v2/auth
router.get('/signup/google', (req, res) => {
    let url = 'https://accounts.google.com/o/oauth2/v2/auth'
    url += '?client_id=' + process.env.GOOGLE_CLIENT_ID
    url += '&redirect_uri=https://localhost:5678/api/signup/redirect'
    url += '&response_type=code'
    // 구글에 등록된 유저 정보 email, profile을 가져오겠다 명시
    url += '&scope=email profile'
    // 완성된 url로 이동
    res.redirect(url)
})

// 구글 계정 선택 화면에서 계정 선택 후, redirect된 주소
router.get('/signup/redirect', async (req, res) => {
    // redirect_uri에 code=라는 쿼리스트링이 들어옵니다.
    // 이 code를 사용해서 구글 인증 서버에 access_token을 요청할 수 있다.
    const { code } = req.query

    try {
        // 구글 인증 서버에 토큰 요청하기
        const res_token = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            // body는 문자열로 변환하여 전송해야 하므로
            // URLSearchParams로 쿼리 문자열 형식으로 변환
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: 'https://localhost:5678/api/signup/redirect',
                grant_type: 'authorization_code'
            }).toString()
        })
        const tokenData = await res_token.json()


        // email, name 등의 사용자 구글 계정 정보 가져오기
        const res_userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            method: 'GET',
            headers: { Authorization: 'Bearer ' + tokenData.access_token }
        })
        const { name, email, id, picture  } = await res_userInfo.json()


        try {
            // 로그인 진행
            const match = await loginUtil({ loginEmail: email, loginPwd: id })
            if (match) {
                req.session.user = {
                    email: req.body.loginEmail,
                    isAuthenticated: true,
                }
                //res.status(200).json({ message: '로그인 성공', result: match })
                res.redirect('/')
                            
            // 회원가입 진행
            } else if(!match) {
                const signupResult = await signupUtil({
                    name: name, email: email, pwd: id, img_url: picture, member_type_id: 2,
                })
                //return res.status(200).json({ message: '회원가입 성공', memId: signupResult.insertId })
                res.redirect('/')
            }
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: '로그인 또는 회원가입 오류' })
        }

    } catch (error) {
        console.error("구글 요청 오류: ", error)
        res.status(500).json({ message: "서버 오류" })
    }
})
/************************************* Google OAuth2 *************************************/



/************************************** Session Mng **************************************/
router.get('/protected', (req, res) => {
    if(req.session?.user?.isAuthenticated) {
        res.status(200).json({ message: '인증된 사용자 입니다.', user: req.session.user });
    } else {
        res.status(401).json({ message: '로그인이 필요합니다.' }); // 인증되지 않은 경우 401 상태 코드 반환
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            console.error('session delete error: ', err)
            return res.status(500).json({ message: '로그아웃 실패' })
        }
        res.clearCookie('connect.sid')
        res.redirect('/')
        // res.status(200).json({ message: '로그아웃 성공' })
    })
})
/************************************** Session Mng **************************************/

/************************************** Naver Oauth2 **************************************/


/************************************** Naver Oauth2 **************************************/
module.exports = router;