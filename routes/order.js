const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, } = require('../utils/middleware')
const order = require('../controllers/order')
router.route('/:id')
    .post(isLoggedIn, order.insertintoCart)
router.route('/new')
    .get(isLoggedIn, order.newOrder)
router.route('/')
    .delete(isLoggedIn, order.deleteOrder)
    .post(isLoggedIn, wrapAsync(order.createOrder))
    .get(isLoggedIn, wrapAsync(order.index))
    .put(wrapAsync(order.updateOrder))
module.exports = router;