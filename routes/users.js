var express = require('express');
var router = express.Router();
var passport = require('passport');
const db = require('../models');
const env = process.env.NODE_ENV || 'development';
var server_config = require('../config/server_config.js')[env];

//This file needs to run and have nothing to export
require('../controllers/user.controller');

router.get(
    '/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: 'success',
        failureRedirect: 'fail'
    })
);

router.get('/auth/facebook/fail', (req, res) => {
    res.status(400).send('Failed to login. please try again later');
});

router.get('/auth/facebook/success', (req, res) => {
    // Successfull login landing page
    res.redirect(server_config.frontend_for_cors + '/');
});

router.get('/logout', (req, res) => {
    if (!req.user) {
        return;
    }

    let user_id = req.user.provider_user_id;
    req.logout();
    if (req.query.deregister) {
        db.User.destroy({ where: { provider_user_id: user_id } })
            .then(() => {
                res.redirect(server_config.frontend_for_cors + '/');
            })
            .catch(() => {
                res.status(400).send('Failed to delete account');
            });
    } else {
        res.redirect(server_config.frontend_for_cors + '/');
    }
});

router.get('/deregister', (req, res) => {
    res.redirect('logout?deregister=1');
});

if (env === 'development') {
    /* GET users listing. */
    router.get('/', function (req, res, next) {
        res.send('respond with a resource');
    });

    router.get('/demo', (req, res) => {
        res.render('demo', { title: 'Facebook Login demo', user: req.user });
    });
}
module.exports = router;
