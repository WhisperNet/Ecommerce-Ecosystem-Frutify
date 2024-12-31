const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const { isValidUser, isValidCashifyAccount } = require('../utils/middleware');
const user = require('../controllers/user');


router.route('/login')
    .get(user.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), wrapAsync(user.login))
router.route('/register')
    .get(user.registerForm)
    .post(isValidUser, wrapAsync(isValidCashifyAccount), wrapAsync(user.register))
router.route('/logout')
    .get((user.logout))

module.exports = router;