const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, } = require('../utils/middleware')
const review = require('../controllers/review')

// /product/:id/review
router.route('/')
    .post(isLoggedIn, wrapAsync(review.createReview))
router.route('/:reviewID')
    .delete(isLoggedIn, wrapAsync(review.deleteReview))

module.exports = router;