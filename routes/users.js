var express = require('express');
var router = express.Router();
require('dotenv').config();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/payment', function(req, res, next) {
  res.render('index', { title: 'main', pageName: 'payment/payment.ejs' });
});


// resultCode=Success&paymentId=20241228NP1181024354
router.get('/payment/resultPay', async function(req, res, next) {
  const { subsPlan, subsPrice, resultCode, paymentId } = req.query;
  const datetime = new Date().toLocaleString()

  res.render('index', { title: '결제결과창', pageName:'payment/resultPay.ejs',
    subsPlan, subsPrice, resultCode, paymentId, datetime
  });

  try {
    const sql = `insert into member (name, email, pwd, phone, eco_point, image_url, member_type_id, subs_id, address)
    values (?, ?, ?, ?, ?, ?, ?, ?, ?)`

    const values = [name, email, pwdHash, phone, 100, 'https://placehold.co/250x200', member_type_id, 1, address]
    const [result] = await pool.execute(sql, values);
    res.status(201).json({ message: '회원가입 성공', memId: result.insertId })

  } catch (error) {
    console.error("memberInsert 오류: ", error)
    res.status(500).json({ message: "서버오류"})
  }
});

module.exports = router;
