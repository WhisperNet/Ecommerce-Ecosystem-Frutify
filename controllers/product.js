const Product = require('../models/product')
const Review = require('../models/review')
module.exports.newProduct = (req, res) => {
    res.render('products/new');
}
module.exports.createProduct = async (req, res) => {
    const product = new Product(req.body.product)
    await product.save()
    res.redirect('/')
}
module.exports.index = async (req, res) => {
    const products = await Product.find({})
    res.render('products/index', { products })
}
module.exports.showProduct = async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate({
            path: 'review',
            populate: {
                path: 'user'
            }
        });
    res.render('products/show', { product })
}