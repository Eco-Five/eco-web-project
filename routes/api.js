var express = require("express");
var router = express.Router();
require("dotenv").config();
const multer = require("multer");
const path = require("path");

/************************************** MySQL CRUD **************************************/
const pool = require("../connDB.js");
const bcrypt = require("bcrypt");
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
  let pwdHash = await hashPwd(pwd);
  const sql = `insert into member (name, email, pwd, phone, eco_point, image_url, member_type_id, subs_id, address)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    name,
    email,
    pwdHash,
    phone || null,
    100,
    img_url,
    member_type_id,
    1,
    address || null,
  ];
  const [result] = await pool.execute(sql, values);
  return result;
};

// 로그인 : 유틸리티 함수
const loginUtil = async (loginInfo) => {
  const { loginEmail, loginPwd } = loginInfo;
  const sql = "select * from member where email = ?";

  const [rows] = await pool.execute(sql, [loginEmail]);
  if (rows.length === 0) {
    return false; // 사용자 없음
  }
  const match = await comparePwd(loginPwd, rows[0].pwd);
  return { match: match, userInfo: rows[0] };
};
/******************************** 일반 회원가입 및 로그인 ********************************/
// 회원가입 : member data DB에 추가 + 비밀번호 해시
router.post("/memberInsert", async (req, res) => {
  try {
    const result = await signupUtil(req.body);
    res.status(201).json({ message: "회원가입 성공", memId: result.insertId });
  } catch (error) {
    console.error("signupHandler 오류: ", error);
    res.status(500).json({ message: "서버오류" });
  }
});

// 로그인 : 회원 이메일 및 비밀번호 해시값 비교
router.post("/memberLogin", async (req, res) => {
  try {
    const { match, userInfo } = await loginUtil(req.body);
    console.log(userInfo);
    if (match) {
      req.session.user = {
        email: userInfo.email,
        name: userInfo.name,
        isAuthenticated: true,
      };
      res.status(200).json({ message: "로그인 성공", result: match });
    } else {
      res
        .status(401)
        .json({ message: "계정이 일치하지 않습니다.", result: match });
    }
  } catch (error) {
    console.error("memberLogin 오류: ", error);
    res.status(500).json({ message: "서버오류" });
  }
});
/******************************** 일반 회원가입 및 로그인 ********************************/

/********************************** 회원정보 찾기 및 수정 **********************************/
// 이메일 찾기
router.post("/findEmail", async (req, res) => {
  const { name, phone } = req.body;

  try {
    sql = "select email from member where name = ? and phone = ?";
    const [rows] = await pool.execute(sql, [name, phone]);
    res.status(201).json({ message: "이메일 찾기 성공", result: rows });
  } catch (error) {
    console.error("이메일 찾기 오류: ", error);
    res.status(500).json({ message: "서버오류" });
  }
});

// 비밀번호 재설정
router.put("/resetPwd", async (req, res) => {
  const { email, pwd, name, phone } = req.body;

  try {
    // 입력 값 검증
    if (!email || !pwd || !name || !phone) {
      return res.status(400).json({ message: "모든 필드를 입력해주세요." });
    }

    // 비밀번호 암호화
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(pwd, 10);

    // 데이터베이스 업데이트
    const sql =
      "UPDATE member SET pwd = ? WHERE email = ? AND name = ? AND phone = ?";
    const [rows] = await pool.execute(sql, [
      hashedPassword,
      email,
      name,
      phone,
    ]);

    if (rows.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "일치하는 회원 정보를 찾을 수 없습니다." });
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
router.get("/signup/google", (req, res) => {
  let url = "https://accounts.google.com/o/oauth2/v2/auth";
  url += "?client_id=" + process.env.GOOGLE_CLIENT_ID;
  url += "&redirect_uri=https://localhost:5678/api/signup/redirect";
  url += "&response_type=code";
  // 구글에 등록된 유저 정보 email, profile을 가져오겠다 명시
  url += "&scope=email profile";
  // 완성된 url로 이동
  res.redirect(url);
});

// 구글 계정 선택 화면에서 계정 선택 후, redirect된 주소
router.get("/signup/redirect", async (req, res) => {
  // redirect_uri에 code=라는 쿼리스트링이 들어옵니다.
  // 이 code를 사용해서 구글 인증 서버에 access_token을 요청할 수 있다.
  const { code } = req.query;

  try {
    // 구글 인증 서버에 토큰 요청하기
    const res_token = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      // body는 문자열로 변환하여 전송해야 하므로
      // URLSearchParams로 쿼리 문자열 형식으로 변환
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "https://localhost:5678/api/signup/redirect",
        grant_type: "authorization_code",
      }).toString(),
    });
    const tokenData = await res_token.json();

    // email, name 등의 사용자 구글 계정 정보 가져오기
    const res_userInfo = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        method: "GET",
        headers: { Authorization: "Bearer " + tokenData.access_token },
      }
    );
    const { name, email, id, picture } = await res_userInfo.json();

    try {
      // 로그인 진행
      const match = await loginUtil({ loginEmail: email, loginPwd: id });
      if (match) {
        req.session.user = {
          email: email,
          name: name,
          isAuthenticated: true,
        };
        //res.status(200).json({ message: '로그인 성공', result: match })
        res.redirect("/");

        // 회원가입 진행
      } else if (!match) {
        const signupResult = await signupUtil({
          name: name,
          email: email,
          pwd: id,
          img_url: picture,
          member_type_id: 2,
        });
        req.session.user = {
          email: email,
          name: name,
          isAuthenticated: true,
        };
        //return res.status(200).json({ message: '회원가입 성공', memId: signupResult.insertId })
        res.redirect("/");
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "로그인 또는 회원가입 오류" });
    }
  } catch (error) {
    console.error("구글 요청 오류: ", error);
    res.status(500).json({ message: "서버 오류" });
  }
});
/************************************* Google OAuth2 *************************************/

/************************************** Session Mng **************************************/
router.get("/protected", (req, res) => {
  if (req.session?.user?.isAuthenticated) {
    res
      .status(200)
      .json({ message: "인증된 사용자 입니다.", user: req.session.user });
  } else {
    res.status(401).json({ message: "로그인이 필요합니다." }); // 인증되지 않은 경우 401 상태 코드 반환
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("session delete error: ", err);
      return res.status(500).json({ message: "로그아웃 실패" });
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
    // res.status(200).json({ message: '로그아웃 성공' })
  });
});
/************************************** Session Mng **************************************/

/******************************** 네이버 쇼핑 ********************************/
// 네이버쇼핑API 서버
router.post("/naverShop", async (req, res) => {
  const query = req.body;
  const page = req.body.page;
  const itemsPerPage = 12;

  try {
    const url = `https://openapi.naver.com/v1/search/shop.json?query=${query.values}&display=100`;

    const responseNaverShop = await fetch(url, {
      method: "GET",
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
      },
    });

    const data = await responseNaverShop.json();
    const items = data.items;

    const totalPages = Math.ceil(items.length / itemsPerPage);

    res.status(200).json({
      result: "정상 작동",
      list: items,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ result: "서버 오류" });
  }
});
/******************************** 네이버 쇼핑 ********************************/

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
    cb(null, "uploads/"); // 'uploads/' 디렉토리에 저장
  },

  // 저장될 파일명 지정
  filename: (req, file, cb) => {
    // 파일 이름 생성: 원래 파일명 + 고유한 값 + 확장자
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // 고유한 값
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    ); // 파일명 구성
  },
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
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  ); // 확장자 검사
  const mimeType = allowedTypes.test(file.mimetype); // MIME 유형 검사

  if (extName && mimeType) {
    cb(null, true); // 조건에 맞는 경우 업로드 허용
  } else {
    cb(new Error("이미지 파일만 업로드 가능합니다.")); // 조건에 맞지 않는 경우 업로드 차단
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
  fileFilter: fileFilter, // 파일 필터링 설정
});

/************************* 커뮤니티글목록 ***************************/
router.get("/board", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // 기본 페이지는 1
    const perPage = 5; // 한 페이지당 5개 글
    const offset = (page - 1) * perPage;
    // LIMIT과 OFFSET 값을 쿼리 인자에 맞게 전달
    const sql = `SELECT b.*, m.name AS name, c.type_name AS type_name
                    FROM board b
                    LEFT JOIN member m ON b.member_id = m.member_id
                    LEFT JOIN content_type c ON b.content_type_id = c.content_type_id
                    ORDER BY b.board_id DESC
                    LIMIT ${perPage} OFFSET ${offset}`; // 쿼리 내에 직접 숫자 값을 삽입
    const [rows] = await pool.execute(sql);
    // 총 글 수를 구해서 페이지 수 계산
    const totalSql = `SELECT COUNT(*) AS total FROM board`;
    const [totalRows] = await pool.execute(totalSql);
    const totalBoards = totalRows[0].total;
    const totalPages = Math.ceil(totalBoards / perPage);
    res.render("index", {
      title: "커뮤니티목록",
      pageName: "board/board.ejs",
      boards: rows,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("커넥션 혹은 SQL쿼리 오류: ", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

/************************* 커뮤니티글상세보기 ***************************/
//http://localhost:5678/api/board/2
router.get("/board/:b_no", async (req, res) => {
  // 쿼리 스트링을 통해 member_id 정보 가져오기
  const b_no = req.params.b_no;
  if (!b_no) {
    return res.status(400).send({ message: "게시글 번호가 누락되었습니다." });
  }
  try {
    const sql = `select b.*, m.name AS name
                    from board b
                    JOIN member m ON b.member_id = m.member_id
                    where board_id = ?`;
    const [rows] = await pool.execute(sql, [b_no]);
    //조회 결과가 없는 경우 처리
    if (rows.length === 0) {
      return res.status(404).send({ message: "해당 글이 없습니다." });
    }
    //성공시 응답
    //res.json(rows) // 결과값을 JSON로 변환하여 전달
    res.render("index", {
      title: "커뮤니티상세보기",
      pageName: "board/read.ejs",
      board: rows[0],
    });
  } catch (error) {
    console.error("커넥션 혹은 SQL쿼리 오류: ", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

/************************* 커뮤니티글작성 ***************************/
//http://localhost:5678/api/board/write
router.post("/board/write", upload.single("fileUpload"), async (req, res) => {
  //사용자가 화면에서 입력한 값 담기
  const { content_type_id, title, content } = req.body;
  const filePath = req.file ? `/uploads/${req.file.filename} ` : null;
  try {
    const sql = `insert into board(content_type_id, title, content, board_date, image_url, member_id)
                        values (?,?,?,now(),?,?)`;
    const values = [content_type_id, title, content, filePath, 1];
    const [result] = await pool.execute(sql, values);
    //조회 결과가 없는 경우 처리
    console.log(result); //1이면 입력 성공. 0이면 입력 실패
    //성공시 응답하기
    res.json({ success: true, result: result });
  } catch (error) {
    console.error("Database error:", error);
    return res
      .status(500)
      .send({ message: "글 쓰기 처리 중 오류가 발생했습니다." });
  }
});

/************************* 커뮤니티글수정-GET ***************************/
// 1. /board/update URL로의 요청이 /api/board/update로 리디렉션됨
// 2. api.js에서 해당 경로를 처리할 수 있도록 GET 요청을 추가하여 수정 페이지를 렌더링
// 3. 수정된 URL 경로를 통해 수정 기능을 정상적으로 작동시킬 수 있다.
router.get("/board/update/:b_no", async (req, res, next) => {
  const b_no = req.params.b_no;
  try {
    const sql = `SELECT b.*, c.type_name AS type_name
                    FROM board b
                    JOIN content_type c ON b.content_type_id = c.content_type_id
                    WHERE board_id = ?`;
    const [rows] = await pool.execute(sql, [b_no]);
    //조회 결과가 없는 경우 처리
    if (rows.length === 0) {
      return res.status(404).send({ message: "해당 글이 없습니다." });
    }
    //성공시 응답 - 수정 폼 렌더링
    //res.json(rows) // 결과값을 JSON로 변환하여 전달
    res.render("index", {
      title: "커뮤니티 수정",
      pageName: "board/update.ejs",
      board: rows[0],
    });
  } catch (error) {
    console.error("커넥션 혹은 SQL쿼리 오류: ", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

/************************* 커뮤니티글수정-PUT***************************/
//http://localhost:5678/api/board/update?b_no=2
router.put(
  "/board/update/:b_no",
  upload.single("fileUpload"),
  async (req, res) => {
    //사용자가 화면에서 수정한 값 담기
    const b_no = req.params.b_no;
    const { content_type_id, title, content } = req.body;
    const filePath = req.file
      ? `/uploads/${req.file.filename} `
      : req.body.fileUpload;
    try {
      //데이터베이스 쿼리 실행 하기
      const sql = `UPDATE board
                    SET content_type_id = ?, title = ?, content = ?, board_date = now(), image_url = ?
                    WHERE board_id = ?`;
      const values = [content_type_id, title, content, filePath, b_no];
      const [result] = await pool.execute(sql, values);
      console.log(result); //1이면 수정 성공. 0이면 수정 실패
      //성공시 응답하기
      res.json({ success: true, result: result });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "글 수정 처리 중 오류가 발생했습니다." });
    }
  }
);

/************************* 커뮤니티글삭제 ***************************/
router.delete("/board/:b_no", async (req, res) => {
  const b_no = req.params.b_no;
  console.log(b_no);
  const sql = "DELETE FROM board WHERE board_id=?";
  try {
    const [result] = await pool.execute(sql, [b_no]);
    console.log(result); //1이면 삭제 성공. 0이면 삭제 실패
    //성공시 응답하기
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "삭제 완료되었습니다." });
    } else {
      res.json({ success: false, message: "삭제 실패했습니다." });
    }
  } catch (error) {
    console.error("Database error:", error);
    return res
      .status(500)
      .send({ message: "글 삭제 처리 중 오류가 발생했습니다." });
  }
});

/************************* 고객문의글목록 ***************************/
router.get("/question", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // 기본 페이지는 1
    const perPage = 5; // 한 페이지당 5개 글
    const offset = (page - 1) * perPage;

    // LIMIT과 OFFSET 값을 쿼리 인자에 맞게 전달
    const sql = `SELECT i.*, m.name AS name, s.status_name AS status
                    from inquiry i
                    LEFT JOIN member m ON i.member_id = m.member_id
                    LEFT JOIN inquiry_status s ON i.inquiry_status_id = s.inquiry_status_id
                    ORDER BY i.inquiry_id DESC
                    LIMIT ${perPage} OFFSET ${offset}`; // 쿼리 내에 직접 숫자 값을 삽입

    const [rows] = await pool.execute(sql);

    // 총 글 수를 구해서 페이지 수 계산
    const totalSql = `SELECT COUNT(*) AS total FROM inquiry`;
    const [totalRows] = await pool.execute(totalSql);
    const totalBoards = totalRows[0].total;
    const totalPages = Math.ceil(totalBoards / perPage);

    res.render("index", {
      title: "고객문의목록",
      pageName: "question/question.ejs",
      questions: rows,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("커넥션 혹은 SQL쿼리 오류: ", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

/************************* 고객문의글상세보기 ***************************/
//http://localhost:5678/api/question/read?q_no=2
router.get("/question/:q_no", async (req, res) => {
  const q_no = req.params.q_no;
  if (!q_no) {
    return res.status(400).send({ message: "게시글 번호가 누락되었습니다." });
  }
  try {
    const sql = `SELECT i.*, m.name AS name, ic.comment AS comment, ic.comment_date AS comment_date
                    FROM inquiry i
                    LEFT JOIN member m ON i.member_id = m.member_id
                    LEFT JOIN inquiry_comment ic ON i.inquiry_id = ic.inquiry_id
                    WHERE i.inquiry_id=?`;
    const [rows] = await pool.execute(sql, [q_no]);
    //조회 결과가 없는 경우 처리
    if (rows.length === 0) {
      return res.status(404).send({ message: "해당 글이 없습니다." });
    }
    //성공시 응답
    //res.json(rows) // 결과값을 JSON로 변환하여 전달
    res.render("index", {
      title: "고객문의상세보기",
      pageName: "question/read.ejs",
      question: rows[0],
    });
  } catch (error) {
    console.error("커넥션 혹은 SQL쿼리 오류: ", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

/************************* 고객문의글작성 ***************************/
router.post("/question/write", async (req, res) => {
  //사용자가 화면에서 입력한 값 담기
  const { content_type_id, title, content } = req.body;
  try {
    //데이터베이스 쿼리 실행 하기
    const sql = `insert into inquiry(content_type_id, title, content, inquiry_date, member_id, inquiry_status_id)
                        values (?,?,?,now(),?,?)`;
    const values = [content_type_id, title, content, 1, 1];
    const [result] = await pool.execute(sql, values);
    //조회 결과가 없는 경우 처리
    console.log(result); //1이면 입력 성공. 0이면 입력 실패
    //성공시 응답하기
    res.json({ success: true, result: result });
  } catch (error) {
    console.error("Database error:", error);
    return res
      .status(500)
      .send({ message: "글 쓰기 처리 중 오류가 발생했습니다." });
  }
});

// /************************* 고객문의댓글작성 ***************************/
// router.post('/question/comment', async(req,res)=>{
//     //사용자가 화면에서 입력한 값 담기
//     const { inquiry_id, comment } = req.body;
//     if (!inquiry_id || !comment) {
//         return res.status(400).json({ success: false, message: "필수 값이 누락되었습니다." });
//     }
//     try{
//         //데이터베이스 쿼리 실행 하기
//         const sql = `insert into inquiry_comment(inquiry_id, comment, comment_date)
//                         values (?, ?, now())`
//         const [result] = await pool.execute(sql, [inquiry_id, comment])
//         if (result.affectedRows > 0) {
//             res.json({ success: true });
//         } else {
//             res.status(500).json({ success: false, message: "댓글 작성에 실패했습니다." });
//         }
//     } catch (error) {
//         console.error("댓글 작성 중 오류: ", error);
//         res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
//     }
// })

/************************* 고객문의글수정-GET ***************************/
router.get("/question/update/:q_no", async (req, res, next) => {
  const q_no = req.params.q_no;

  try {
    const sql = `SELECT i.*, c.type_name AS type_name
                    FROM inquiry i
                    JOIN content_type c ON i.content_type_id = c.content_type_id
                    WHERE inquiry_id = ?`;
    const [rows] = await pool.execute(sql, [q_no]);

    //조회 결과가 없는 경우 처리
    if (rows.length === 0) {
      return res.status(404).send({ message: "해당 글이 없습니다." });
    }
    //성공시 응답 - 수정 폼 렌더링
    //res.json(rows) // 결과값을 JSON로 변환하여 전달
    res.render("index", {
      title: "고객문의 수정",
      pageName: "question/update.ejs",
      inquiry: rows[0],
    });
  } catch (error) {
    console.error("커넥션 혹은 SQL쿼리 오류: ", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

/************************* 고객문의글수정-PUT***************************/
router.put("/question/update/:q_no", async (req, res) => {
  const q_no = req.params.q_no;
  //사용자가 화면에서 수정한 값 담기
  const { content_type_id, title, content } = req.body;
  //필수 필드 확인
  if (!content_type_id || !title || !content) {
    console.error("Missing fields : ", req.body);
    return res.status(400).send("필수 필드를 채우세요.");
  }
  try {
    //데이터베이스 쿼리 실행 하기
    const sql = `UPDATE inquiry
                    SET content_type_id = ?, title = ?, content = ?, inquiry_date = now()
                    WHERE inquiry_id = ?`;
    const values = [content_type_id, title, content, q_no];
    const [result] = await pool.execute(sql, values);
    //조회 결과가 없는 경우 처리
    console.log(result); //1이면 수정 성공. 0이면 수정 실패
    //성공시 응답하기
    res.json({ success: true, result: result });
  } catch (error) {
    console.error("Database error:", error);
    return res
      .status(500)
      .send({ message: "글 수정 처리 중 오류가 발생했습니다." });
  }
});

/************************* 고객문의글삭제 ***************************/
router.delete("/question/:q_no", async (req, res) => {
  //DELETE 요청 시, 데이터를 본문으로 보내고 있기 때문에, 서버에서는 req.body.b_no로 받아야 함
  const q_no = req.body.q_no;
  //외래키 제약 조건 : inquiry_comment 참조 데이터 먼저 삭제
  const sql1 = "DELETE FROM inquiry_comment WHERE inquiry_id=?";
  const sql2 = "DELETE FROM inquiry WHERE inquiry_id=?";
  try {
    await pool.execute(sql1, [q_no]);
    const [result] = await pool.execute(sql2, [q_no]);
    //조회 결과가 없는 경우 처리
    console.log(result); //1이면 삭제 성공. 0이면 삭제 실패
    //성공시 응답하기
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "삭제 완료되었습니다." });
    } else {
      res.json({ success: false, message: "삭제 실패했습니다." });
    }
  } catch (error) {
    console.error("Database error:", error);
    return res
      .status(500)
      .send({ message: "글 삭제 처리 중 오류가 발생했습니다." });
  }
});

/************************* 공지사항 글목록 ***************************/
router.get("/notice", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;
    const offset = (page - 1) * perPage;
    console.log("Pagination values:", { page, perPage, offset });

    let rows = [];
    let totalNotices = 0;

    // Fetch notices
    try {
      const sql = `
        SELECT b.notice_id AS id, b.title, b.notice_date, m.name AS member_name, c.type_name AS category
        FROM notice b
        LEFT JOIN member m ON b.member_id = m.member_id
        LEFT JOIN content_type c ON b.content_type_id = c.content_type_id
        ORDER BY b.notice_id DESC
        LIMIT 10 OFFSET 0;
      `;
      const [result] = await pool.execute(sql, [perPage, offset]);
      rows = result;
    } catch (queryError) {
      console.error("Error fetching notices:", queryError);
    }

    // Fetch total count
    try {
      const totalSql = `SELECT COUNT(*) AS total FROM notice`;
      const [totalResult] = await pool.execute(totalSql);
      totalNotices = totalResult[0]?.total || 0;
    } catch (countError) {
      console.error("Error fetching total count:", countError);
    }

    const totalPages = Math.ceil(totalNotices / perPage);

    res.render("index", {
      title: "공지사항목록",
      pageName: "notice/notice.ejs",
      notices: rows,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).send("Internal Server Error");
  }
});

/************************* 공지사항 상세보기 ***************************/
router.get("/notice/:b_no", async (req, res) => {
  const b_no = req.params.b_no;

  if (!b_no) {
    return res.status(400).send({ message: "게시글 번호가 누락되었습니다." });
  }

  try {
    // Increment the views column
    const updateSql = `UPDATE notice SET views = views + 1 WHERE notice_id = ?`;
    await pool.execute(updateSql, [b_no]);

    // Fetch the updated article details
    const selectSql = `
      SELECT b.notice_id AS id, b.title, b.notice_date AS date, b.content, b.views, 
      m.name AS member_name, c.type_name AS category
      FROM notice b
      LEFT JOIN member m ON b.member_id = m.member_id
      LEFT JOIN content_type c ON b.content_type_id = c.content_type_id
      WHERE b.notice_id = ?;
    `;
    const [rows] = await pool.execute(selectSql, [b_no]);

    if (rows.length === 0) {
      return res.status(404).send({ message: "해당 글이 없습니다." });
    }

    const notice = rows[0];

    res.render("index", {
      title: "공지사항 상세보기",
      pageName: "notice/read.ejs",
      notice,
    });
  } catch (error) {
    console.error("Error fetching notice details:", error);
    res.status(500).send("Internal Server Error");
  }
});

/************************* 고객문의글수정-GET ***************************/
router.get('/notice/update/:b_no', async (req, res) => {
  const b_no = req.params.b_no;

  try {
    console.log("Fetching notice for b_no:", b_no);

    const sql = `
      SELECT
          n.notice_id,
          n.title,
          n.content,
          c.type_name AS category
      FROM
          notice n
      JOIN
          content_type c
          ON n.content_type_id = c.content_type_id
      WHERE
          n.notice_id = ?;
    `;

    const [rows] = await pool.execute(sql, [b_no]);

    console.log("SQL Result Rows:", rows);

    if (rows.length > 0) {
      const notice = rows[0];
      res.render('update', { notice });
    } else {
      res.status(404).send("Notice not found.");
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});


module.exports = router;
