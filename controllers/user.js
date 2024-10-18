const express = require('express');
const router = express.Router();
const User = require('../models/user');

module.exports.loginForm = (req, res) => {
    res.render('user/login');
}
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/product');
}
module.exports.registerForm = (req, res) => {
    res.render('user/register');
}
module.exports.register = async (req, res) => {
    const { cashifyUsername, username, password } = req.body;
    const user = new User({ username, cashifyUsername });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', 'welcome to Frutify!');
        res.redirect('/product');
    })
}
module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
}