var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');

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


/************************* 이미지 업로드 ***************************/
// 1. 저장 설정 (storage)
/**
 * storage 설정은 multer가 업로드된 파일을 저장하는 방식을 정의합니다.
 * - `destination`: 파일이 저장될 디렉토리를 지정합니다.
 * - `filename`: 저장될 파일의 이름을 지정합니다. (중복 방지를 위해 고유한 이름 사용)
 */
const storage = multer.diskStorage({
    // 파일이 저장될 디렉토리 경로
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // 'uploads/' 디렉토리에 저장
    },

    // 저장될 파일명 지정
    filename: (req, file, cb) => {
        // 파일 이름 생성: 원래 파일명 + 고유한 값 + 확장자
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // 고유한 값
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // 파일명 구성
    }
});

// 2. 파일 필터 설정 (fileFilter)
/**
 * 파일 필터 설정은 특정 조건에 따라 파일 업로드를 허용하거나 거부합니다.
 * - `allowedTypes`: 허용할 파일 확장자를 정의합니다.
 * - `extName`: 파일 확장자가 허용 목록에 포함되어 있는지 확인합니다.
 * - `mimeType`: 파일의 MIME 유형이 허용 목록에 포함되어 있는지 확인합니다.
 * - 콜백(`cb`)에 `true`를 전달하면 파일 업로드를 허용하고, `false` 또는 에러 메시지를 전달하면 업로드를 차단합니다.
 */
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/; // 허용할 파일 확장자
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase()); // 확장자 검사
    const mimeType = allowedTypes.test(file.mimetype); // MIME 유형 검사

    if (extName && mimeType) {
        cb(null, true); // 조건에 맞는 경우 업로드 허용
    } else {
        cb(new Error('이미지 파일만 업로드 가능합니다.')); // 조건에 맞지 않는 경우 업로드 차단
    }
};

// 3. multer 설정 (upload)
/**
 * multer 설정은 파일 업로드의 전반적인 동작을 정의합니다.
 * - `storage`: 파일 저장 방식 (diskStorage 사용)
 * - `limits`: 업로드 파일의 크기 제한 (예: 10MB)
 * - `fileFilter`: 업로드를 허용할 파일 조건
 */
const upload = multer({
    storage: storage, // 저장 설정
    limits: { fileSize: 10 * 1024 * 1024 }, // 파일 크기 제한 (10MB)
    fileFilter: fileFilter // 파일 필터링 설정
});


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
router.post('/board/write', upload.single('fileUpload'), async(req,res)=>{
    //사용자가 화면에서 입력한 값 담기
    const {content_type_id, title, content} = req.body
    const filePath = req.file ? `/uploads/${req.file.filename} `: null;
    try{
        const sql = `insert into board(content_type_id, title, content, board_date, image_url, member_id)
                        values (?,?,?,now(),?,?)`
        const values = [content_type_id,title,content,filePath,1]
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

router.patch('/board/update', upload.single('fileUpload'), async (req, res) => {
    const { b_no, content_type_id, title, content } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!b_no) {
        return res.status(400).json({ message: "게시글 ID가 누락되었습니다." });
    }

    try {
        // 데이터베이스 업데이트
        const updates = [];
        const values = [];

        // 수정하려는 필드만 업데이트
        if (content_type_id) {
            updates.push("content_type_id = ?");
            values.push(content_type_id);
        }
        if (title) {
            updates.push("title = ?");
            values.push(title);
        }
        if (content) {
            updates.push("content = ?");
            values.push(content);
        }
        if (filePath) {
            updates.push("image_url = ?");
            values.push(filePath);
        }

        values.push(b_no); // 마지막에 ID 추가

        if (updates.length === 0) {
            return res.status(400).json({ message: "수정할 필드가 없습니다." });
        }

        const sql = `UPDATE board SET ${updates.join(", ")} WHERE board_id = ?`;
        const [result] = await pool.execute(sql, values);

        if (result.affectedRows > 0) {
            res.json({ success: true, message: '수정 완료되었습니다.' });
        } else {
            res.json({ success: false, message: '수정 실패했습니다.' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: '서버 오류 발생', error });
    }
});


/************************* 커뮤니티글수정-PUT***************************/
//http://localhost:5678/api/board/update?b_no=2
router.put('/board/update', upload.single('fileUpload'), async(req,res)=>{
    //const b_no=req.body.b_no
    //사용자가 화면에서 수정한 값 담기
    const {b_no, content_type_id, title, content} = req.body
    const filePath = req.file ? `/uploads/${req.file.filename} `: null;
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
        const values = [content_type_id,title,content,filePath,b_no]
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
router.delete('/board/delete', async(req, res)=>{
    //DELETE 요청 시, 데이터를 본문으로 보내고 있기 때문에, 서버에서는 req.body.b_no로 받아야 함
    const b_no = req.body.b_no
    console.log(b_no)
    const sql = "DELETE FROM board WHERE board_id=?"
    try{
        const [result] = await pool.execute(sql,[b_no])
        //조회 결과가 없는 경우 처리
        console.log(result)//1이면 삭제 성공. 0이면 삭제 실패
        //성공시 응답하기
        if (result.affectedRows > 0) {
            res.json({ success: true, message: '삭제 완료되었습니다.' })
        } else {
            res.json({ success: false, message: '삭제 실패했습니다.' })
        }
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
        const sql = `SELECT i.*, m.name AS name, ic.comment AS comment, ic.comment_date AS comment_date
                    FROM inquiry i
                    LEFT JOIN member m ON i.member_id = m.member_id
                    LEFT JOIN inquiry_comment ic ON i.inquiry_id = ic.inquiry_id
                    WHERE i.inquiry_id=?`
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
router.post('/question/write', async(req,res)=>{
    //사용자가 화면에서 입력한 값 담기
    const {content_type_id, title, content} = req.body
    try{
        //데이터베이스 쿼리 실행 하기
        const sql = `insert into inquiry(content_type_id, title, content, inquiry_date, member_id, inquiry_status_id)
                        values (?,?,?,now(),?,?)`
        const values = [content_type_id,title,content,1,1]
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

/************************* 고객문의글삭제 ***************************/
router.delete('/question/delete', async(req, res)=>{
    //DELETE 요청 시, 데이터를 본문으로 보내고 있기 때문에, 서버에서는 req.body.b_no로 받아야 함
    const q_no = req.body.q_no
    //외래키 제약 조건 : inquiry_comment 참조 데이터 먼저 삭제
    const sql1 = "DELETE FROM inquiry_comment WHERE inquiry_id=?"
    const sql2 = "DELETE FROM inquiry WHERE inquiry_id=?"
    try{
        await pool.execute(sql1,[q_no])
        const [result] = await pool.execute(sql2,[q_no])
        //조회 결과가 없는 경우 처리
        console.log(result)//1이면 삭제 성공. 0이면 삭제 실패
        //성공시 응답하기
        if (result.affectedRows > 0) {
            res.json({ success: true, message: '삭제 완료되었습니다.' })
        } else {
            res.json({ success: false, message: '삭제 실패했습니다.' })
        }
    }catch(error){
        console.error('Database error:', error)
        return res.status(500).send({message:'글 삭제 처리 중 오류가 발생했습니다.'})
        }
    })

module.exports = router;