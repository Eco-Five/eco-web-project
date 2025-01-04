var express = require('express')
var router = express.Router()
require('dotenv').config()

const app = express()

/***************************** MySQL CRUD *****************************/
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

/******************************** GET *********************************/
// 로그인 정보 확인 API + 비밀번호 해시 비교
router.get('/member', async (req, res) => {
    // 쿼리 스트링을 통해 member_id 정보 가져오기
    const memId = req.query.memId
    try {
        sql = 'select * from member where email = ?'
        const [rows] = await pool.execute(sql, [memId])
        res.json(rows) // 결과값을 JSON로 변환하여 전달

    } catch (error) {
        console.error("api/member 오류: ", error);
        res.status(500).json({ message: "서버오류" })
    }
})

/* 클라이언트 측의 쿼리스트링을 이용한 함수 예시
async function getMember(memberId) {
    const response = await fetch(`/member?member_id=${memberId}`); // 쿼리스트링을 포함한 URL
    const data = await response.json();
    console.log(data);
}
// 사용 예시
getMember(1); // member_id가 1인 회원 조회
*/

/******************************** POST ********************************/
// 회원가입 데이터 DB에 추가하는 API + 비밀번호 해시
router.post('/memberInsert', async (req, res) => {
    // 클라이언트로부터 받은 데이터
    const { name, email, pwd, phone, member_type_id, address } = req.body;
    try {
        // 비동기 처리된 함수 선언 시, await을 붙이는 이유는
        // promise가 해결된 후의 값을 반환받기 위해서 입니다.
        let pwdHash = await hashPwd(pwd)
        const sql = `insert into member (name, email, pwd, phone, eco_point, image_url, member_type_id, subs_id, address)
                    values (?, ?, ?, ?, ?, ?, ?, ?, ?)`

        const values = [name, email, pwdHash, phone, 100, 'https://placehold.co/250x200', member_type_id, 1, address]
        const [result] = await pool.execute(sql, values);
        res.status(201).json({ message: '회원가입 성공', memId: result.insertId })

    } catch (error) {
        console.error("memberInsert 오류: ", error)
        res.status(500).json({ message: "서버오류" })
    }
})


// 로그인 정보 확인 API + 비밀번호 해시 비교
router.post('/memberLogin', async (req, res) => {
    // 쿼리 스트링을 통해 member_id 정보 가져오기
    const { loginEmail, loginPwd } = req.body
    try {
        sql = 'select * from member where email = ?'
        const [rows] = await pool.execute(sql, [loginEmail])
        let match = await comparePwd(loginPwd, rows[0].pwd)

        if (match) {
            res.cookie('uid', rows[0].email, { httpOnly: true, path: '/' })
            res.cookie('pwd', match)
            res.status(201).json({ message: '로그인 성공', rows: match })
        } else {
            res.status(201).json({ message: '계정이 일치하지 않습니다.' })
        }

    } catch (error) {
        console.error("memberLogin 오류: ", error);
        res.status(500).json({ message: "서버오류" })
    }
})


/*
async function addMember() {
    const memberInfo = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        pwd: document.getElementById('pwd').value,
        phone: document.getElementById('phone').value,
        member_type_id: document.getElementById('member_type_id').value,
        address: document.getElementById('address').value,
    };

    const response = await fetch('api/memberInsert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberInfo), // 객체를 JSON 문자열로 변환하여 전송
    });

    const data = await response.json();
    console.log(data);
}
*/



/************************** Google OAuth2 *****************************/
// 로그인 버튼을 누르면 도착하는 목적지 라우터
// https://accounts.google.com/o/oauth2/v2/auth
router.get('/auth/google', (req, res) => {
    let url = 'https://accounts.google.com/o/oauth2/v2/auth'
    url += '?client_id=' + process.env.GOOGLE_CLIENT_ID
    url += '&redirect_uri=https://localhost:5678/api/login/redirect'
    url += '&response_type=code'
    // 구글에 등록된 유저 정보 email, profile을 가져오겠다 명시
    url += '&scope=email profile'
    // 완성된 url로 이동
    res.redirect(url)
})

// 구글 계정 선택 화면에서 계정 선택 후, redirect된 주소
router.get('/login/redirect', async (req, res) => {
    // redirect_uri에 code=라는 쿼리스트링이 들어옵니다.
    // 이 code를 사용해서 구글 인증 서버에 access_token을 요청할 수 있다.
    const { code } = req.query
    console.log(code)

    // 구글 인증 서버에 토큰 요청하기
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        // body는 문자열로 변환하여 전송해야 하므로  
        // URLSearchParams로 쿼리 문자열 형식으로 변환
        body: new URLSearchParams({
            code: code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: 'https://localhost:5678/api/login/redirect',
            grant_type: 'authorization_code'
        }).toString()
    })
    res.json(response.json())
})




/************************** Google OAuth2 *****************************/


module.exports = router;