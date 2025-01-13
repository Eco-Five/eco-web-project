var express = require('express');
var router = express.Router();
require('dotenv').config()

const { v4: uuidv4 } = require('uuid');
const pool = require('../connDB.js')
const modelLogic = require('./modelLogic.js'); // 이 줄을 위로 이동합니다.
const instanceLogic = new modelLogic(); // 인스턴스 생성

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// payment page router
router.get('/payment', function(req, res, next) {
  const authResult = instanceLogic.sessionAuth(req, res)
  res.render('index', { title: 'main', pageName: 'payment/payment.ejs' });
});


/****************************** Naver Pay ******************************/
router.post('/naverPay', async (req, res) => {
  const authResult = instanceLogic.sessionAuth(req, res)
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
/****************************** Naver Pay ******************************/


/************************** Naver Pay Reserve **************************/
// resultCode=Success&paymentId=20241228NP1181024354
router.get('/payment/resultPay', async function(req, res, next) {
  try {
    const { resultCode } = req.query

    if(resultCode === 'Success') {
      const { subsPlan, subsPrice, paymentId } = req.query
      const currentDate = new Date()
      const datetime = currentDate.toISOString().split('T')[0]

      const sql = `insert into payment (payment_date, payment_token, start_date, end_date, member_id, subs_id, payment_type_id, subs_status_id)
            values (curdate(), ?, curdate(), adddate(curdate(), INTERVAL 1 MONTH), ?, ?, 5, 1)`

      const values = [paymentId, req.session.user.member_id, instanceLogic.subsInfo[subsPlan]]
      const [result] = await pool.execute(sql, values);

      res.render('index', { title: '결제결과창', pageName:'payment/resultPay.ejs',
        subsPlan, subsPrice, resultCode, paymentId, datetime
      });

    } else {
      const { resultMessage, reserveId } = req.query
      req.redirect(`/payment?message=${resultMessage}`)
    }

  } catch (error) {
    console.error("resultPay 오류: ", error)
    res.status(500).send("서버오류가 발생하였습니다.")
  }
});
/************************** Naver Pay Reserve **************************/


/************************** Naver Pay Cancel **************************/
router.get('/payment/cancel', async (req, res) => {
  const authResult = instanceLogic.sessionAuth(req, res)

  try {
    const { paymentId, subsPrice } = req.query
    url = 'https://dev-pub.apis.naver.com/naverpay-partner/naverpay/payments/v1/cancel'
    
    console.log(paymentId, subsPrice);

    // AbortController를 사용하여 타임아웃 처리
    const timeout = 60000
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const cancelInfo = new URLSearchParams({
      "paymentId": paymentId,
      "cancelAmount": subsPrice,
      "cancelReason": 'testCancel',
      "cancelRequester": 2
    })
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_PAY_CLIENT_ID,
        "X-Naver-Client-Secret": process.env.NAVER_PAY_CLIENT_SECRET,
        "X-NaverPay-Chain-Id": process.env.NAVER_PAY_CHAIN_ID,
        "X-NaverPay-Idempotency-Key": uuidv4(),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: cancelInfo,
      signal: controller.signal  // AbortController signal 추가
    })
    clearTimeout(timeoutId); // 요청 완료 후 타임아웃 제거
    
    if (!response.ok) {
      throw new Error('네이버페이 API 요청 실패');
    }

    try {
      const sql = "delete from payment where payment_token = ?"
      const [result] = await pool.execute(sql, [paymentId])

      if(result.affectedRows === 1) {
        res.redirect('/users/payment?message=결제가 취소되었습니다.')
      } else {
        res.redirect('/users/payment?message=요청하신 결제정보가 없습니다.')
      }
    } catch {
      res.redirect('/users/payment?message=관리자에게 문의해주세요.')
    }

  } catch (error) {
      res.status(500).json({message: error})
  }
})
/************************** Naver Pay Cancel **************************/


/**************************** Youtube API *****************************/
router.get('/youtube', async (req, res, next) => {
  const API_KEY = process.env.YOUTUBE_API_KEY
  const url = 'https://youtube.googleapis.com/youtube/v3/search?'

  try {
    const response = await fetch(url + new URLSearchParams({
          key           : API_KEY,
          part          : 'snippet',
          maxResults    : 3,
          q             : '제로웨이스트',
          regionCode    : 'kr',
          order         : 'viewCount',
          type          : 'video',
          videoDuration : 'medium'
      }), {
        method: 'GET'
    });

    const data = await response.json();
    const youtubeData = { items: data.items };
    res.status(200).json(youtubeData)

  } catch (error) {
      console.error('Error fetching YouTube data:', error);
  }
})
/**************************** Youtube API *****************************/


module.exports = router;