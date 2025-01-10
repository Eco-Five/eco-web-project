var express = require('express');
var router = express.Router();
const noticeDB = require('./noticeConnDB');


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

/* 공지사항 목록 */
router.get('/notice', function(req, res, next) {
  res.render('index', { title: '공지사항목록',pageName:'notice/notice.ejs'});
});
/* 공지사항 작성 */
router.get('/notice/write', function(req, res, next) {
  res.render('index', { title: '공지사항작성',pageName:'notice/write.ejs'});
});
/* 공지사항 글 상세보기 */
router.get('/notice/read', function(req, res, next) {
  res.render('index', { title: '공지사항상세보기',pageName:'notice/read.ejs'});
});
/* 공지사항 수정 */
router.get('/notice/update', function(req, res, next) {
  res.render('index', { title: '공지사항수정',pageName:'notice/update.ejs'});
});

module.exports = router;