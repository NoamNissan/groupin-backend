var express = require('express');
var models = require('../models');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  models.Session.count().then(res => console.log("there are currently " + res + " sessions in the database"));
  res.render('index', { title: 'Express' });
});

module.exports = router;
