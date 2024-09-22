const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

mongoose.model("Review", reviewSchema)