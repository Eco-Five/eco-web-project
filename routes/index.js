var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'main', pageName: 'home.ejs' });
});
router.get('/product', function(req, res, next) {
  res.render('index', { title: '상품목록', pageName: 'product/itemList.ejs' });
});

module.exports = router;
