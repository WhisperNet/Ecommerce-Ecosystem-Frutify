const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    product: {
        type: [String],
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Order", orderSchema)