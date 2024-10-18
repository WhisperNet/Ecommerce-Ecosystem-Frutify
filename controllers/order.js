const User = require('../models/user');
const Product = require('../models/product')
const Order = require('../models/order')
const axios = require('axios');

module.exports.insertintoCart = (req, res) => {
    const id = req.params.id
    const quantity = req.body.quantity
    if (!req.session.cart) {
        req.session.cart = {}
    }
    req.session.cart[id] = Math.abs(quantity)
    res.redirect('/product')
}

module.exports.newOrder = async (req, res) => {
    let totalPrice = 0
    const addedProducts = []
    for (let id in req.session.cart) {
        const foundProduct = await Product.findById(id)
        addedProducts.push({ name: foundProduct.name, price: foundProduct.price, quantity: req.session.cart[id] })
        const { price } = foundProduct
        totalPrice = totalPrice + (price * req.session.cart[id])
    }
    res.render('order/new', { addedProducts, totalPrice })
}
module.exports.deleteOrder = (req, res) => {
    req.session.cart = {}
    res.redirect('/product')
}
module.exports.createOrder = async (req, res) => {
    console.log(req.session.cart)
    const orderedProducts = []
    let totalPrice = 0
    for (let id in req.session.cart) {
        const foundProduct = await Product.findById(id)
        orderedProducts.push(foundProduct.name)
        const { price } = foundProduct
        totalPrice = totalPrice + (price * req.session.cart[id])
    }
    const user = await User.findOne({ username: req.user.username });
    const sender = user.cashifyUsername;
    const reciever = "admin@frutify";
    const amount = totalPrice;

    const transactionData = {
        sender,
        reciever,
        amount,
        otp: req.body.otp
    };
    let response
    try {
        response = await axios.post('http://localhost:3001/transactions', transactionData);
    } catch (error) {
        console.error(error.response.data);
    }
    req.session.cart = {}
    const orderData = {
        product: orderedProducts,
        price: totalPrice,
        status: response.data.response,
        address: req.body.address,
        phone: req.body.phone
    }
    const order = new Order(orderData)
    user.order.push(order)
    await user.save()
    await order.save()
    // await axios.post('http://localhost:3003/order', {...order,orderKey:process.env.ORDER_KEY});
    res.redirect('/product')
}
module.exports.index = async (req, res) => {
    const user = await User.findById(req.user._id).populate('order')
    res.render('order/index', { orders: user.order })
}
module.exports.updateOrder = async (req, res) => {
    const { orderKey, status, id } = req.body
    if (orderKey === process.env.ORDER_KEY) {
        const order = await Order.findById(id)
        order.status = status
        await order.save()
        res.status(200).send("Success")
    } else {
        res.status(400).send("Failder")
    }
}