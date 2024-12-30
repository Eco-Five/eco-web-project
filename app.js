var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); // .env 파일을 로드합니다.

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 미들웨어 설정
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS 설정
app.use(
  cors({
    origin: "*",
  })
);

// 네이버 API 서버 코드 통합

app.get("/api/naver/shop", async (req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  const { query } = req.params.query
  console.log(query);
  //let query = "친환경";
  let display = req.query.display || 20;
  const encodedQuery = encodeURIComponent(query);
  const url = `https://openapi.naver.com/v1/search/shop.json?query=${encodedQuery}&display=${display}&timestamp=${Date.now()}`;
  const ClientID = process.env.NAVER_CLIENT_ID;
  const ClientSecret = process.env.NAVER_CLIENT_SECRET;

  
  try {
    const response = await axios.get(url, {
      headers: {
        "X-Naver-Client-Id": ClientID,
        "X-Naver-Client-Secret": ClientSecret,
      },
    });
    let data = response.data.items;
    res.json(data);  //브라우저에 JSON 데이터 반환
    // list.ejs로 데이터를 전달하여 렌더링 res.render("list", { products: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 기존 라우터 설정
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 404 에러 처리
app.use(function(req, res, next) {
  next(createError(404));
});

// 에러 처리
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
