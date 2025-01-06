var express = require('express');
var router = express.Router();
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



/* 커뮤니티 목록 */
router.get('/board', function(req, res, next) {
  res.render('index', { title: '커뮤니티목록',pageName:'board/board.ejs'});
});
/* 커뮤니티 작성 */
router.get('/board/write', function(req, res, next) {
  res.render('index', { title: '커뮤니티작성',pageName:'board/write.ejs'});
});
/* router.get('/board/:id', function(req, res, next) {
/* router.get('/board/update/:id', function(req, res, next) {
  //사용자가 선택한 값을 쿼리스트링으로 받아오는 코드 추가함
  let id = req.params.id
  res.render('index', { title: '상세보기', pageName: 'posts/read.ejs', id:id });
  res.render('index', { title: '상세보기', pageName: 'posts/update.ejs', id:id });
}); */
/* 커뮤니티 글 상세보기 */
router.get('/board/read', function(req, res, next) {
  res.render('index', { title: '커뮤니티상세보기',pageName:'board/read.ejs'});
});
/* 커뮤니티 수정 */
router.get('/board/update', function(req, res, next) {
  res.render('index', { title: '커뮤니티수정',pageName:'board/update.ejs'});
});


/* 고객문의 목록 */
router.get('/question', function(req, res, next) {
  res.render('index', { title: '고객문의목록',pageName:'question/question.ejs'});
});
/* 고객문의 작성 */
router.get('/question/write', function(req, res, next) {
  res.render('index', { title: '고객문의작성',pageName:'question/write.ejs'});
});
/* 고객문의 글 상세보기 */
router.get('/question/read', function(req, res, next) {
  res.render('index', { title: '고객문의상세보기',pageName:'question/read.ejs'});
});
/* 고객문의 수정 */
router.get('/question/update', function(req, res, next) {
  res.render('index', { title: '고객문의수정',pageName:'question/update.ejs'});
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

module.exports = router;