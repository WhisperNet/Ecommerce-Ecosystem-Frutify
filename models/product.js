const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    review: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
})

module.exports = mongoose.model("Product", productSchema)