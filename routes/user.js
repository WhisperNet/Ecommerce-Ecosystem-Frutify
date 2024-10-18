const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const { isValidUser, } = require('../utils/middleware');
const user = require('../controllers/user');


router.route('/login')
    .get(user.loginForm)
    .post(passport.authenticate('local', { failureRedirect: '/user/login' }), wrapAsync(user.login))
router.route('/register')
    .get(user.registerForm)
    .post(isValidUser, wrapAsync(user.register))
router.route('/logout')
    .get((user.logout))

module.exports = router;
