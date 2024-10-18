const Review = require('../models/review');
const Product = require('../models/product');
const User = require('../models/user');

module.exports.createReview = async (req, res) => {
    let flag = false;
    const userID = req.user._id;
    console.log(userID)
    const productID = req.params.id;
    const user = await User.findById(userID).populate('order');
    console.log(user)
    const foundProduct = await Product.findById(productID);
    user.order.forEach(elm => {
        if (elm.status === 'Delivered') {
            if (elm.product.includes(foundProduct.name)) {
                flag = true;
            }
        }
    })
    if (!flag) {
        req.flash('error', 'You can only review products you have ordered and received');
        return res.redirect(`/product/${productID}`);
    }
    const review = new Review(req.body);
    review.user = userID;
    await review.save();
    foundProduct.review.push(review);
    await foundProduct.save();
    req.flash('success', 'Review added successfully');
    res.redirect(`/product/${productID}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID);
    if (!review.user.equals(req.user._id)) {
        return res.redirect(`/product/${id}`);
    }
    await Product.findByIdAndUpdate(id, { $pull: { review: reviewID } });
    await Review.findByIdAndDelete(reviewID)
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/product/${id}`);
}