var express = require('express');
var router = express.Router();
const pool = require('../connDB.js')
require('dotenv').config();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/***************************** Naver Pay ******************************/
router.get('/payment', function(req, res, next) {
  res.render('index', { title: 'main', pageName: 'payment/payment.ejs' });
});

/***************************** Naver Pay ******************************/
const { v4: uuidv4 } = require('uuid')

router.post('/naverPay', async (req, res) => {
  const { subsPlan, subsPrice } = req.body

  const payInfo = {
      "merchantPayKey": "mpaykey",
      "productName": subsPlan,
      "productCount": 1,
      "totalPayAmount": parseInt(subsPrice),
      "taxScopeAmount": parseInt(subsPrice),
      "taxExScopeAmount": 0,
      "returnUrl": `https://localhost:5678/users/payment/resultPay?subsPlan=${subsPlan}&subsPrice=${subsPrice}`
  }

  url = 'https://dev-pub.apis.naver.com/naverpay-partner/naverpay/payments/v2/reserve'
  try {
      const naverPayInfo = await fetch(url, {
          method: 'POST',
          headers: {
              "X-Naver-Client-Id": process.env.NAVER_PAY_CLIENT_ID,
              "X-Naver-Client-Secret": process.env.NAVER_PAY_CLIENT_SECRET,
              "X-NaverPay-Chain-Id": process.env.NAVER_PAY_CHAIN_ID,
              "X-NaverPay-Idempotency-Key": uuidv4(),
              "Content-Type": 'application/json'
          },
          body: JSON.stringify(payInfo)
      })
      const data = await naverPayInfo.json()
      res.status(201).json(data)
      
  } catch (error) {
      res.status(500).json({message: error})
  }
})
/***************************** Naver Pay ******************************/


/************************** Naver Pay Result **************************/
// resultCode=Success&paymentId=20241228NP1181024354
router.get('/payment/resultPay', async function(req, res, next) {
  const { subsPlan, subsPrice, resultCode, paymentId } = req.query
  const datetime = new Date().toISOString().split('T')[0]
  const end_date = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0];

  res.render('index', { title: '결제결과창', pageName:'payment/resultPay.ejs',
    subsPlan, subsPrice, resultCode, paymentId, datetime
  });

  if(req.session?.user?.isAuthenticated) {
    try {
      const sql = `insert into payment (payment_date, payment_token, start_date, end_date, member_id, subs_id, payment_type_id, subs_status_id) 
                    values (?, ?, ?, ?, (select member_id from member where email = ?), (select subs_id from subs where name = ?), 5, 1);`
  
      const values = [datetime, paymentId, datetime, end_date, req.session.user.email, subsPlan]
  
      const [result] = await pool.execute(sql, values);
      console.log(result);
  
    } catch (error) {
      console.error("resultPay 오류: ", error)
    }
  }
});
/************************** Naver Pay Result **************************/


module.exports = router;