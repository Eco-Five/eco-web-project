var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); // .env 파일을 로드합니다.

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');  // hogi 추가

var app = express();

// fs & cors 추가
// npm install cors
const fs = require('fs');       // hogi 추가
app.use(cors())                 // hogi 추가

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 미들웨어 설정
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


/**************************************** Session & Redis ***************************************/
const session = require('express-session')
const { RedisStore } = require('connect-redis')
const Redis = require('ioredis')

// Redis 클라이언트 설정
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379
})

// express-session 미들웨어를 설정
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,  // 초기화되지 않은 세션 저장하지 않음
    cookie: { secure: true, maxAge: 1000 * 60 * 60 }
    // secure : https 사용 시, true로 설정
    // maxAge : 쿠키 만료 기간을 1시간으로 설정
}))
/**************************************** Session & Redis ***************************************/


/****************************************** https ***************************************/
app.use((req, res, next) => {
  if (req.secure) {
    next(); // HTTPS인 경우 다음 미들웨어로 이동
  } else {
    res.redirect(`https://${req.headers.host}${req.url}`); // HTTPS로 리디렉션
  }
});
/****************************************** https ***************************************/


// 라우터 설정 (세션 설정 후 등록)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);     // hogi 추가


// 404 에러 처리
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;