if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const ejsmate = require('ejs-mate');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const User = require('./models/user');
const wrapAsync = require('./utils/wrapAsync');
const Product = require('./models/product')
const Order = require('./models/order')
const axios = require('axios');
const ExpressError = require('./utils/error')
const { isLoggedIn, isValidUser, isValidOrder, isValidProduct, isValidReview } = require('./utils/middleware')
const userRoutes = require('./routes/user')
const productRotes = require('./routes/product')
const orderRoutes = require('./routes/order')
const reviewRoutes = require('./routes/review')

const mongoUrl = process.env.mongoUrl || 'mongodb://localhost:27017/fruitifyDB';
mongoose.connect(mongoUrl)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB', err);
    })

app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: mongoUrl,
        collectionName: 'sessions'
    }),
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/', (req, res) => {
    res.render('home');
})
app.use('/user', userRoutes)
app.use('/product', productRotes)
app.use('/order', orderRoutes)
app.use('/product/:id/review', reviewRoutes)

// app.post('/order/:id', isLoggedIn, (req, res) => {
//     const id = req.params.id
//     const quantity = req.body.quantity
//     if (!req.session.cart) {
//         req.session.cart = {}
//     }
//     req.session.cart[id] = Math.abs(quantity)
//     res.redirect('/product')
// })

// app.get('/order/new', isLoggedIn, wrapAsync(async (req, res) => {
//     let totalPrice = 0
//     const addedProducts = []
//     for (let id in req.session.cart) {
//         const foundProduct = await Product.findById(id)
//         addedProducts.push({ name: foundProduct.name, price: foundProduct.price, quantity: req.session.cart[id] })
//         const { price } = foundProduct
//         totalPrice = totalPrice + (price * req.session.cart[id])
//     }
//     res.render('order/new', { addedProducts, totalPrice })
// }))
// app.delete('/order', isLoggedIn, (req, res) => {
//     req.session.cart = {}
//     res.redirect('/product')
// })
// app.post('/order', isLoggedIn, wrapAsync(async (req, res) => {
//     const orderedProducts = []
//     let totalPrice = 0
//     for (let id in req.session.cart) {
//         const foundProduct = await Product.findById(id)
//         orderedProducts.push(foundProduct.name)
//         const { price } = foundProduct
//         totalPrice = totalPrice + (price * req.session.cart[id])
//     }
//     const user = await User.findOne({ username: req.user.username });
//     const sender = user.cashifyUsername;
//     const reciever = "admin@frutify";
//     const amount = totalPrice;

//     const transactionData = {
//         sender,
//         reciever,
//         amount,
//         otp: req.body.otp
//     };
//     let response
//     try {
//         response = await axios.post('http://localhost:3001/transactions', transactionData);
//         console.log(response);
//     } catch (error) {
//         console.error(error.response.data);
//     }
//     req.session.cart = {}
//     const orderData = {
//         product: orderedProducts,
//         price: totalPrice,
//         status: response.data.response,
//         address: req.body.address,
//         phone: req.body.phone
//     }
//     const order = new Order(orderData)
//     user.order.push(order)
//     console.log(order)
//     await user.save()
//     await order.save()
//     // await axios.post('http://localhost:3003/order', {...order,orderKey:process.env.ORDER_KEY});
//     res.redirect('/product')
// }))
// app.get('/order', isLoggedIn, wrapAsync(async (req, res) => {
//     const user = await User.findById(req.user._id).populate('order')
//     console.log(user.order)
//     res.render('order/index', { orders: user.order })
// }))
// app.put('/order', wrapAsync(async (req, res) => {
//     const { orderKey, status, id } = req.body
//     if (orderKey === process.env.ORDER_KEY) {
//         const order = await Order.findById(id)
//         order.status = status
//         await order.save()
//         res.status(200).send("Success")
//     } else {
//         res.status(400).send("Failder")
//     }
// }))
app.all('*', (req, res) => {
    throw new ExpressError("Page Not Found", 404)
})
app.use((err, req, res, next) => {
    const { message = "Something went wrong", statusCode = 500, stack } = err
    res.status(statusCode).render("error", { message, stack })
})
app.listen(3002, () => {
    console.log('Server is running on port 3002');
})