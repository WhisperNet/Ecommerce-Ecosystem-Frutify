const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    product: {
        type: String,
        required: true,
        enum: ['Mangoes', 'Bananas', 'Apples']
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Delivered']
    }
})

module.exports = mongoose.model("Order", orderSchema)