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


/******************************** PUT *********************************/



/******************************* PATCH ********************************/



/****************************** DELETE ********************************/


/************************* 커뮤니티글목록 ***************************/
//http://localhost:5678/api/board
router.get('/board', async(req,res)=>{
    try{
        const sql = `select b.*, m.name AS name
                    from board b
                    JOIN member m ON b.member_id = m.member_id
                    ORDER BY b.board_id DESC`
        const [rows] = await pool.execute(sql)
        //res.json(rows)
        //데이터를 템플릿으로 전달
        res.render('index',{
            title:'커뮤니티목록', 
            pageName: 'board/board.ejs',
            boards:rows
            })
    }catch(error){
        console.error("커넥션 혹은 SQL쿼리 오류: ", error);
        res.status(500).json({ message: "서버 오류" })
    }
    
})

/************************* 커뮤니티글상세보기 ***************************/
//http://localhost:5678/api/board/read?b_no=2
router.get('/board/read', async (req, res) => {
    // 쿼리 스트링을 통해 member_id 정보 가져오기
    const b_no = req.query.b_no

    if (!b_no) {
        return res.status(400).send({ message: "게시글 번호가 누락되었습니다." });
    }

    try {
        const sql = `select b.*, m.name AS name
                    from board b
                    JOIN member m ON b.member_id = m.member_id
                    where board_id = ?`
        const [rows] = await pool.execute(sql, [b_no])
        //조회 결과가 없는 경우 처리
        if(rows.length===0){
            return res.status(404).send({message:'해당 글이 없습니다.'})
        }
        //성공시 응답
        //res.json(rows) // 결과값을 JSON로 변환하여 전달
        res.render('index',{
            title:'커뮤니티상세보기', 
            pageName: 'board/read.ejs',
            board: rows[0]
            })
    } catch (error) {
        console.error("커넥션 혹은 SQL쿼리 오류: ", error);
        res.status(500).json({ message: "서버 오류" })
    }
})

/************************* 커뮤니티글작성 ***************************/
//http://localhost:5678/api/board/write
router.post('/board/write', async(req,res)=>{
    //사용자가 화면에서 입력한 값 담기
    const {content_type_id, title, content} = req.body
    try{
        //데이터베이스 쿼리 실행 하기
        const sql = `insert into board(content_type_id, title, content, board_date, image_url, member_id)
                        values (?,?,?,now(),?,?)`
        const values = [content_type_id,title,content,'https://placehold.co/180x100',1]
        const [result] = await pool.execute(sql,values)
        //조회 결과가 없는 경우 처리
        console.log(result)//1이면 입력 성공. 0이면 입력 실패
        //성공시 응답하기
        res.json({success:true, result:result})
    }catch(error){
        console.error('Database error:', error)
        return res.status(500).send({message:'글 쓰기 처리 중 오류가 발생했습니다.'})
    }
    })

/************************* 커뮤니티글수정-GET ***************************/
// 1. /board/update URL로의 요청이 /api/board/update로 리디렉션됨
// 2. api.js에서 해당 경로를 처리할 수 있도록 GET 요청을 추가하여 수정 페이지를 렌더링
// 3. 수정된 URL 경로를 통해 수정 기능을 정상적으로 작동시킬 수 있다.
router.get('/board/update', async (req, res, next) => {
    // 쿼리 스트링을 통해 member_id 정보 가져오기
    const b_no = req.query.b_no

    try {
        const sql = `SELECT b.*, c.type_name AS type_name
                    FROM board b
                    JOIN content_type c ON b.content_type_id = c.content_type_id
                    WHERE board_id = ?`
        const [rows] = await pool.execute(sql, [b_no])

        //조회 결과가 없는 경우 처리
        if(rows.length===0){
            return res.status(404).send({message:'해당 글이 없습니다.'})
        }
        //성공시 응답 - 수정 폼 렌더링
        //res.json(rows) // 결과값을 JSON로 변환하여 전달
        res.render('index',{
            title:'커뮤니티 수정', 
            pageName: 'board/update.ejs',
            board: rows[0]
            })
    } catch (error) {
        console.error("커넥션 혹은 SQL쿼리 오류: ", error);
        res.status(500).json({ message: "서버 오류" })
    }
})

/************************* 커뮤니티글수정-PUT***************************/
//http://localhost:5678/api/board/update?b_no=2
router.put('/board/update', async(req,res)=>{
    //const b_no=req.body.b_no
    //사용자가 화면에서 수정한 값 담기
    const {b_no, content_type_id, title, content} = req.body
    //필수 필드 확인
    if(!content_type_id || !title||!content){
    console.error("Missing fields : ", req.body)
    return res.status(400).send("필수 필드를 채우세요.")
    }
    try{
        //데이터베이스 쿼리 실행 하기
        const sql = `UPDATE board
                    SET content_type_id = ?, title = ?, content = ?, board_date = now(), image_url = ?
                    WHERE board_id = ?`;
        const values = [content_type_id,title,content,'https://placehold.co/180x100',b_no]
        const [result] = await pool.execute(sql,values)
        //조회 결과가 없는 경우 처리
        console.log(result)//1이면 수정 성공. 0이면 수정 실패
        //성공시 응답하기
        res.json({success:true, result:result})
    }catch(error){
        console.error('Database error:', error)
        return res.status(500).send({message:'글 수정 처리 중 오류가 발생했습니다.'})
    }
    })

/************************* 커뮤니티글삭제 ***************************/
router.delete('/board/delete/:b_no', async(req, res)=>{
    //사용자가 화면에서 수정한 값 담기
    const b_no = req.params.b_no
    console.log(b_no)
    const sql = "DELETE FROM board WHERE board_id=?"
    try{
        const [result] = await db.get().execute(sql,[b_no])
        //조회 결과가 없는 경우 처리
        console.log(result)//1이면 삭제 성공. 0이면 삭제 실패
        //성공시 응답하기
        res.json({result:result})
    }catch(error){
        console.error('Database error:', error)
        return res.status(500).send({message:'글 삭제 처리 중 오류가 발생했습니다.'})
        }
    })


/************************* 고객문의글목록 ***************************/
//http://localhost:5678/api/question
router.get('/question', async(req,res)=>{
    try{
        const sql = `select i.*, m.name AS name, s.status_name AS status
                    from inquiry i
                    LEFT JOIN member m ON i.member_id = m.member_id
                    LEFT JOIN inquiry_status s ON i.inquiry_status_id = s.inquiry_status_id
                    ORDER BY i.inquiry_id DESC`
        const [rows] = await pool.execute(sql)
        //res.json(rows)
        //데이터를 템플릿으로 전달
        res.render('index',{
            title:'고객문의목록', 
            pageName: 'question/question.ejs',
            questions:rows
            })
    }catch(error){
        console.error("커넥션 혹은 SQL쿼리 오류: ", error);
        res.status(500).json({ message: "서버 오류" })
    }
})

/************************* 고객문의글상세보기 ***************************/
//http://localhost:5678/api/question/read?q_no=2
router.get('/question/read', async (req, res) => {
    // 쿼리 스트링을 통해 member_id 정보 가져오기
    const q_no = req.query.q_no

    if (!q_no) {
        return res.status(400).send({ message: "게시글 번호가 누락되었습니다." });
    }

    try {
        const sql = `SELECT i.*, m.name AS name, ic.*
                    FROM inquiry i, member m, inquiry_comment ic
                    WHERE i.inquiry_id=?
                    AND i.inquiry_id =ic.inquiry_id`
        // const sql = `select i.*, m.name AS name
        //             from inquiry i
        //             JOIN member m ON i.member_id = m.member_id
        //             where inquiry_id = ?`
        const [rows] = await pool.execute(sql, [q_no])
        //조회 결과가 없는 경우 처리
        if(rows.length===0){
            return res.status(404).send({message:'해당 글이 없습니다.'})
        }
        //성공시 응답
        //res.json(rows) // 결과값을 JSON로 변환하여 전달
        res.render('index',{
            title:'고객문의상세보기', 
            pageName: 'question/read.ejs',
            question: rows[0]
            })
    } catch (error) {
        console.error("커넥션 혹은 SQL쿼리 오류: ", error);
        res.status(500).json({ message: "서버 오류" })
    }
})

/************************* 고객문의글작성 ***************************/
router.post('/board/write', async(req,res)=>{
    //사용자가 화면에서 입력한 값 담기
    const {content_type_id, title, content} = req.body
    try{
        //데이터베이스 쿼리 실행 하기
        const sql = `insert into inquiry(content_type_id, title, content, inquiry_date, image_url, member_id)
                        values (?,?,?,now(),?,?)`
        const values = [content_type_id,title,content,'https://placehold.co/180x100',1]
        const [result] = await pool.execute(sql,values)
        //조회 결과가 없는 경우 처리
        console.log(result)//1이면 입력 성공. 0이면 입력 실패
        //성공시 응답하기
        res.json({success:true, result:result})
    }catch(error){
        console.error('Database error:', error)
        return res.status(500).send({message:'글 쓰기 처리 중 오류가 발생했습니다.'})
    }
    })

/************************* 고객문의글수정-GET ***************************/
router.get('/question/update', async (req, res, next) => {
    const q_no = req.query.q_no

    try {
        const sql = `SELECT i.*, c.type_name AS type_name
                    FROM inquiry i
                    JOIN content_type c ON i.content_type_id = c.content_type_id
                    WHERE inquiry_id = ?`
        const [rows] = await pool.execute(sql, [q_no])

        //조회 결과가 없는 경우 처리
        if(rows.length===0){
            return res.status(404).send({message:'해당 글이 없습니다.'})
        }
        //성공시 응답 - 수정 폼 렌더링
        //res.json(rows) // 결과값을 JSON로 변환하여 전달
        res.render('index',{
            title:'고객문의 수정', 
            pageName: 'question/update.ejs',
            inquiry: rows[0]
            })
    } catch (error) {
        console.error("커넥션 혹은 SQL쿼리 오류: ", error);
        res.status(500).json({ message: "서버 오류" })
    }
})

/************************* 고객문의글수정-PUT***************************/
router.put('/question/update', async(req,res)=>{
    //사용자가 화면에서 수정한 값 담기
    const {q_no, content_type_id, title, content} = req.body
    //필수 필드 확인
    if(!content_type_id || !title||!content){
    console.error("Missing fields : ", req.body)
    return res.status(400).send("필수 필드를 채우세요.")
    }
    try{
        //데이터베이스 쿼리 실행 하기
        const sql = `UPDATE inquiry
                    SET content_type_id = ?, title = ?, content = ?, inquiry_date = now()
                    WHERE inquiry_id = ?`;
        const values = [content_type_id,title,content,q_no]
        const [result] = await pool.execute(sql,values)
        //조회 결과가 없는 경우 처리
        console.log(result)//1이면 수정 성공. 0이면 수정 실패
        //성공시 응답하기
        res.json({success:true, result:result})
    }catch(error){
        console.error('Database error:', error)
        return res.status(500).send({message:'글 수정 처리 중 오류가 발생했습니다.'})
    }
    })

module.exports = router;