var express = require('express');
var router = express.Router();

/***************************** MySQL CRUD *****************************/
const pool = require('../connDB.js')
//  GET(조회), POST(입력), PUT(수정), DELETE(삭제)

// sql쿼리 요청 방법은 2가지가 있습니다.
// pool.query(sql, params)   : 매번 새 SQL 파싱하므로 비교적 느림
// pool.execute(sql, params) : Prepared Statement 재사용으로 비교적 빠름(추천)

// execute 함수는 아래와 같이 구성되어 있으며, rows와 fields를 반환합니다.

// sample) const [rows, fields] = await pool.execute(sql, [params]);
// rows는 쿼리 실행결과로 반환된 데이터의 배열입니다.
// fields는 실행결과에 대한 메타데이터를 포함하는 배열입니다.

/******************************** GET *********************************/
router.get('/member', async (req, res) => {
    // 쿼리 스트링을 통해 member_id 정보 가져오기
    const memId = req.query.memId

    try {
        sql = 'select * from member where member_id = ?'
        const [rows] = await pool.execute(sql, [memId])
        res.json(rows) // 결과값을 JSON로 변환하여 전달

    } catch (error) {
        console.error("커넥션 혹은 SQL쿼리 오류: ", error);
        res.status(500).json({ message: "서버 오류" })
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
router.post('/insertMember', async (req, res) => {
    // 클라이언트로부터 받은 데이터
    const { name, email, pwd, phone, member_type_id, address } = req.body;
    try {
        const sql = `insert into member (name, email, pwd, phone, eco_point, image_url, member_type_id, subs_id, address) 
                        values (?, ?, ?, ?, ?, ?, ?, ?, ?)`

        const values = [name, email, pwd, phone, 100, 'https://placehold.co/250x200', member_type_id, 1, address]
        const [result] = await pool.execute(sql, values);
        res.status(201).json({ message: '회원가입 성공', memId: result.insertId })

    } catch (error) {
        console.error(object)
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

    const response = await fetch('/addMember', {
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


// 네이버 API 서버 코드 통합
router.post("/naver/shop", async (req, res) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    const { query } = req.params.query
    console.log(query);

    //let query = "친환경";
    let display = req.query.display || 20;
    const url = `https://openapi.naver.com/v1/search/shop.json?query=${query}&display=${display}`;
    const ClientID = process.env.NAVER_CLIENT_ID;
    const ClientSecret = process.env.NAVER_CLIENT_SECRET;

    try {
        const response = await axios.get(url, {
            headers: {
                "X-Naver-Client-Id": ClientID,
                "X-Naver-Client-Secret": ClientSecret,
            },
        });

        let data = response.data.items;
        res.json(data);  //브라우저에 JSON 데이터 반환

        // list.ejs로 데이터를 전달하여 렌더링 res.render("list", { products: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }


    const response = await fetch('/addMember', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberInfo), // 객체를 JSON 문자열로 변환하여 전송
    });

    const data = await response.json();
});



/******************************** PUT *********************************/



/******************************* PATCH ********************************/



/****************************** DELETE ********************************/


module.exports = router;