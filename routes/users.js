var express = require('express');
var router = express.Router();
var passport = require('passport');

//This file needs to run and have nothing to export
require('../controllers/user.controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email']}));
router.get('/auth/facebook/check', (req,res) => {res.send('everything is fine')});

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/users/success',
      failureRedirect: '/users/fail'
    }));

router.get('/fail', (req,res) => {
  // Failed login landing page
  res.send("Something went wrong...");
});

router.get('/success', (req,res) => {
  // Successfull login landing page
  // res.redirect('/');
    res.redirect('/users/demo');
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        console.log('logout failed. what?');
        res.redirect('/users/demo');
    })
})

//res.render('index', { title: 'Express' });
router.get('/demo', (req,res) => {
    res.render('demo', {title : 'Facebook Login demo', user : req.user});
});
module.exports = router;
