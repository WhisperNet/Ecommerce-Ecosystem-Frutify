const { orderSchema, userSchema, productSchema, reviewSchema } = require('./schema')
const ExpressError = require('./error')
const axios = require('axios')
module.exports.isValidOrder = (req, res, next) => {
    const { error } = orderSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}
module.exports.isValidProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}
module.exports.isValidUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}
module.exports.isValidReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('user/login')
    }
    else {
        next()
    }
}
module.exports.isValidCashifyAccount = async (req, res, next) => {
    const { cashifyUsername, id } = req.body

    try {
        const response = await axios.post('http://localhost:3001/verify', { cashifyUsername, id })
        if (response.data.response === 'User verified') {
            next()
        } else {
            throw new ExpressError('Invalid Cashify Account: Verification failed', 400)
        }
    } catch (error) {
        throw new ExpressError('Invalid Cashify Account: Verification failed', 400)
    }
}