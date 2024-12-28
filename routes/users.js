var express = require('express');
var router = express.Router();
require('dotenv').config();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/payment', function(req, res, next) {
  res.render('index', {
    title: 'main',
    pageName: 'payment/payment.ejs',
    clientId: process.env.NAVER_PAY_CLIENT_ID,
    chainId: process.env.NAVER_PAY_CHAIN_ID,
    localhostIP: process.env.LOCALHOST_IP
  });
});

// resultCode=Success&paymentId=20241228NP1181024354
router.get('/payment/resultPay', function(req, res, next) {
  let subsPlan = req.query.subsPlan
  let subsPrice = req.query.subsPrice
  let resultCode = req.query.resultCode
  let paymentId = req.query.paymentId
  let datetime = new Date().toLocaleString()

  res.render('index', {
    title: '고객문의수정',
    pageName:'payment/resultPay.ejs',
    subsPlan: subsPlan,
    subsPrice: subsPrice,
    resultCode: resultCode,
    paymentId: paymentId,
    datetime: datetime
  });
});

module.exports = router;
