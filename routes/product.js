const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isValidProduct } = require('../utils/middleware')
const product = require('../controllers/product')

router.route('/')
    .post(isLoggedIn, isValidProduct, wrapAsync(product.createProduct))
    .get(isLoggedIn, wrapAsync(product.index))
router.route('/new')
    .get(isLoggedIn, product.newProduct)
router.route('/:id')
    .get(isLoggedIn, wrapAsync(product.showProduct))

module.exports = router;