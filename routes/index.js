var express = require('express');
var router = express.Router();
const path = require('path');

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
// 목록
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

module.exports = router;