var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'main', pageName: 'main/home.ejs' });
});

router.get('/about', function(req, res, next) {
  res.render('index', { title: 'about', pageName: 'main/about.ejs' });
});


module.exports = router;
