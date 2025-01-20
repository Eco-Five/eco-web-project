var express = require('express');
var router = express.Router();
const path = require('path');

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
  const user = req.session.user;  
  const category = req.query.category || 'all';  
  const page = req.query.page || 1;  
  res.render('index', { title: '커뮤니티목록', pageName: 'board/board.ejs', user: user, category: category, page: page});
});
//글 상세보기 
router.get('/board/read', function(req, res, next) {
  const b_no = req.params.b_no
  res.redirect(`/api/board/${b_no}`);
});
// 글 작성
router.get('/board/write', function(req, res, next) {
  const user = req.session.user || null; 
  res.render('index', { title: '커뮤니티작성', pageName:'board/write.ejs', user: user });
});
// 글 수정 
router.get('/board/update/:b_no', function(req, res, next) {
  const b_no = req.params.b_no
  res.render('index', {title:'커뮤니티수정', pageName:'board/update.ejs', b_no:b_no})
});

/* 고객문의 */
// 목록
router.get('/question', function(req, res, next) {
  const user = req.session.user;  
  const category = req.query.category || 'all';  
  const page = req.query.page || 1;  
  res.render('index', { title: '고객문의목록', pageName: 'question/question.ejs', user: user, category: category, page: page});
});
// 글 상세보기 
router.get('/question/read', function(req, res, next) {
  const q_no = req.params.q_no
  res.redirect(`/api/question/${q_no}`);
});
// 글 작성
router.get('/question/write', function(req, res, next) {
  const user = req.session.user || null; 
  res.render('index', { title: '고객문의작성', pageName:'question/write.ejs', user: user });
});
// 글 수정 
router.get('/question/update/:q_no', function(req, res, next) {
  const q_no = req.params.q_no
  res.render('index', {title:'고객문의수정', pageName:'question/update.ejs', q_no:q_no})
});

/* 상품목록 페이지 */
router.get('/product', function(req, res, next) {
  res.render('index', { title: '상품목록', pageName: 'product/itemList.ejs' });
});
/* 마이 페이지 */
router.get('/mypage', function(req, res, next) {
  const member_id = req.session.user.member_id
  res.render('index', { title: '마이페이지', pageName: 'mypage/mypage.ejs', member_id:member_id });
});

module.exports = router;