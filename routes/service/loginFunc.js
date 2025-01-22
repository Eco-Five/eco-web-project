const pool = require('../../connDB.js')
const bcrypt = require('bcrypt')

class loginFunc {
    /*********************************  구독상품종류  *************************************/
    subsInfo = {
        "기본형" : 2,
        "프리미엄" : 3,
        "기업형" : 4
    }
    /*********************************  구독상품종류  *************************************/

    /*********************************  SessionAuth  *************************************/
    // 권한에 따른 접근 제한 로직
    sessionAuth = (req, res) => {
        if(req.session?.user?.isAuthenticated) {
            return req.session.user
        } else {
            return res.redirect('/?message=로그인이 필요합니다!')
        }
    }
    /*********************************  SessionAuth  *************************************/

    /*******************************  Password hashing  **********************************/
    // 비밀번호 해시화
    hashPwd = async (password) => {
        const saltRounds = 10; // 해시 반복 횟수
        const hashedPwd = await bcrypt.hash(password, saltRounds);
        return hashedPwd; // hash 문자열 반환
    }

    // 로그인 시 비밀번호 검증
    comparePwd = async (inputPwd, storedHashedPwd) => {
        const match = await bcrypt.compare(inputPwd, storedHashedPwd);
        return match; // true 또는 false 반환
    }
    /*******************************  Password hashing  **********************************/

    /******************************** Login & Register ***********************************/
    // sql쿼리 요청 방법은 2가지가 있습니다.
    // pool.query(sql, params)   : 매번 새 SQL 파싱하므로 비교적 느림
    // pool.execute(sql, params) : Prepared Statement 재사용으로 비교적 빠름(추천)
    // execute 함수는 아래와 같이 구성되어 있으며, rows와 fields를 반환합니다.

    // sample) const [rows, fields] = await pool.execute(sql, [params]);
    // rows는 쿼리 실행결과로 반환된 데이터의 배열입니다.
    // fields는 실행결과에 대한 메타데이터를 포함하는 배열입니다.
    

    // 회원가입 : 유틸리티 함수
    signupUtil = async (memInfo) => {
        // 클라이언트로부터 받은 데이터
        const { name, email, pwd, phone, img_url, member_type_id, address } = memInfo;

        // 비동기 처리된 함수 선언 시, await을 붙이는 이유는 promise가 해결된 후의 값을 반환받기 위해서 입니다.
        let pwdHash = await this.hashPwd(pwd)
        const sql = `insert into member (name, email, pwd, phone, eco_point, image_url, member_type_id, subs_id, address)
                    values (?, ?, ?, ?, ?, ?, ?, ?, ?)`

        const values = [name, email, pwdHash, phone || null, 100, img_url, member_type_id, 1, address || null]
        const [result] = await pool.execute(sql, values)
        return result
    }


    // 로그인 : 유틸리티 함수
    loginUtil = async (loginInfo) => {
        const { loginEmail, loginPwd } = loginInfo
        const sql = 'select * from member where email = ?'
        
        const [rows] = await pool.execute(sql, [loginEmail])
        if (rows.length === 0) {
            return false; // 사용자 없음
        }
        const match = await this.comparePwd(loginPwd, rows[0].pwd)
        return { match: match, userInfo: rows[0] }
    }

    
    // 세션 유저정보 전처리
    sessionInfo = async (userInfo) => {
        return {
            member_id: userInfo.member_id,
            name: userInfo.name,
            email: userInfo.email,
            phone: userInfo.phone,
            eco_point: userInfo.eco_point,
            image_url : userInfo.image_url,
            member_type_id: userInfo.member_type_id,
            subs_id: userInfo.subs_id,
            address: userInfo.address,
            isAuthenticated: true,
        }
    }
    /******************************** Login & Register ***********************************/
}

module.exports = loginFunc