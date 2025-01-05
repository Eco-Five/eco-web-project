var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');  // hogi 추가

var app = express();

// fs & cors 추가
// npm install cors
const fs = require('fs');       // hogi 추가
const cors = require('cors');   // hogi 추가 (npm install cors)
app.use(cors())                 // hogi 추가


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**************************************** Session ***************************************/
const session = require('express-session')
const RedisStore = require('connect-redis')
const Redis = require('ioredis')

// Redis 클라이언트 설정
const redisClient = new Redis({
  host: localhost, port: 6379
})

// express-session 미들웨어를 설정
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true, maxAge: 1000 * 60 * 60 }
    // secure : https 사용 시, true로 설정
    // maxAge : 쿠키 만료 기간을 1시간으로 설정
}))
/**************************************** Session ***************************************/

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


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;