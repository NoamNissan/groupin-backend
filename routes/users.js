var express = require('express');
var router = express.Router();
var passport = require('passport');
const db = require('../models');

//This file needs to run and have nothing to export
require('../controllers/user.controller');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email']}));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: 'success',
      failureRedirect: 'fail'
    }));

router.get('/auth/facebook/fail', (req,res) => {
  // Failed login landing page
  res.status(400).send('Something went wrong...');
});

router.get('/auth/facebook/success', (req,res) => {
  // Successfull login landing page
    res.redirect('../../demo');

    // TODO
    // To integrate with FE we want to change to answer to something like this
    // res.status(200).send('ok');
});

router.get('/logout', (req, res) => {
    if(!req.user) {
        return;
    }
    let user_id = req.user.provider_user_id;
    req.session.destroy((err) => {
        if(err) {
            console.log('logout failed. what what?');
        }
        if(req.query.deregister) {
            console.log('also removing user from DB');
            db.User.destroy({where : {provider_user_id : user_id}});
        }
        res.redirect('demo');
    })
});

router.get('/deregister', (req,res) => {
    res.redirect('logout?deregister=1');

});

//res.render('index', { title: 'Express' });
router.get('/demo', (req,res) => {
    res.render('demo', {title : 'Facebook Login demo', user : req.user});
});
module.exports = router;
