var express = require('express');
var router = express.Router();
const path = require('path');
var axios = require('axios');
const pool  = require('../connDB');
require('dotenv').config()


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'main', pageName: 'main/home.ejs' });
});

router.get('/login', function(req, res, next) {
  res.render('index', { title: '로그인', pageName: 'login/login.ejs' });
});

router.get('/login/find', function(req, res, next) {
  res.render('index', { title: '회원정보 찾기', pageName: 'login/find.ejs' });
});

router.get('/register', function(req, res, next) {
  res.render('index', { title: '회원가입', pageName: 'register/register.ejs' });
});

router.get('/about', function(req, res, next) {
  res.render('index', { title: 'about', pageName: 'main/about.ejs' });
});


/* 커뮤니티 */
//목록
router.get('/board', function(req, res, next) {
  res.redirect('/api/board');
});
// 글 상세보기 
router.get('/board/read', function(req, res, next) {
  const b_no = req.params.b_no
  res.redirect(`/api/board/${b_no}`);
});
// 글 작성 
router.get('/board/write', function(req, res, next) {
  res.render('index', { title: '커뮤니티작성',pageName:'board/write.ejs'});
});
// 글 수정 - GET 
router.get('/board/update/:b_no', function(req, res, next) {
  const b_no = req.params.b_no
  res.redirect(`/api/board/update/${b_no}`);
});
// 글 수정 - PUT 
router.put('/board/update/:b_no', function(req, res, next) {
  const b_no = req.params.b_no
  res.redirect(`/api/board/update/${b_no}`);
});


/* 고객문의 */
// 목록
router.get('/question', function(req, res, next) {
  res.redirect('/api/question');
});
// 글 상세보기 
router.get('/question/read', function(req, res, next) {
  const q_no = req.params.q_no
  res.redirect(`/api/question/${q_no}`);
});
// 글 작성 
router.get('/question/write', function(req, res, next) {
  res.render('index', { title: '고객문의작성',pageName:'question/write.ejs'});
});
// //댓글 작성
// router.get('/question/read', function(req, res, next) {
//   const q_no = req.params.q_no
//   res.render('index', {pageName:'question/read.ejs'});
// })
// 글 수정 - GET 
router.get('/question/update/:q_no', function(req, res, next) {
  const q_no = req.params.q_no
  res.redirect(`/api/question/update/${q_no}`);
});
// 글 수정 - PUT 
router.put('/question/update/:q_no', function(req, res, next) {
  const q_no = req.params.q_no
  res.redirect(`/api/question/update/${q_no}`);
});

/* 상품목록 페이지 */
router.get('/product', function(req, res, next) {
  res.render('index', { title: '상품목록', pageName: 'product/itemList.ejs' });
});
/* 마이 페이지 */
router.get('/mypage', function(req, res, next) {
  res.render('index', { title: '마이페이지', pageName: 'mypage/mypage.ejs' });
});

/* 네이버 로그인 */
router.get('/auth/naver/callback', async (req, res, next) => {
  console.log('네이버 코드 받기: ' + req.query.code);
  console.log('네이버 상태 받기: ' + req.query.state);
  const code = req.query.code;
  const state = req.query.state;
  try {
    const res1 = await axios.post('https://nid.naver.com/oauth2.0/token', null, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      params: {
        grant_type: "authorization_code",
        client_id: process.env.NAVER_LOGIN_CLIENT_ID,
        client_secret: process.env.NAVER_LOGIN_CLIENT_SECRET,
        redirect_uri: "https://localhost:5678/auth/naver/callback",
        code: code,
        state: state
      }
    });
    
    const accessToken = res1.data.access_token;
    console.log("accessToken:", accessToken);

    const res2 = await axios.post('https://openapi.naver.com/v1/nid/me', null, {
      headers: {
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      }
    });

    console.log(res2.data);
    const { name, email, mobile } = res2.data.response;
    console.log(name, email, mobile);

    try {
      const sql1 = 'SELECT * FROM member WHERE email=?';
      const [rows] = await pool.execute(sql1, [email]);
      if (rows.length > 0) {
        return res.redirect('/');
      }
      const sql='INSERT INTO member (name, email, phone, member_type_id,subs_id ) VALUES (?, ?, ?, ?, ?)'
      const [naver] = await pool.execute(sql, [name, email, mobile, 3, 1]);
      
      res.redirect('/');
      return res.status(201).json({ message: '네이버 로그인 성공', rows: naver })
      } catch (error) {
            console.error(error);
  }

  } catch (error) {
    console.error("네이버 로그인 오류: ", error);
    res.status(500).json({ message: "서버오류" })
  }
});

/* 공지사항 목록 */
router.get('/notice', (req, res, next) => {
  res.redirect('/api/notice');
});

/* 공지사항 상세보기 */
router.get('/notice/:b_no', (req, res, next) => {
  const b_no = req.params.b_no;
  res.redirect(`/api/notice/${b_no}`);
});

/* 공지사항 수정 */ 
router.put('/notice/update/:b_no', function(req, res, next) {
  const b_no = req.params.b_no;
  res.render(`notice/update/${b_no}`);
});

module.exports = router;