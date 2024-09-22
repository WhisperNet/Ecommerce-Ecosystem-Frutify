const { required } = require("joi")
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const pasportLocalMonggose = require("passport-local-mongoose")

const userSchema = new Schema({
    cashifyUsername: {
        type: String,
        required: true,
        unique: true
    },
    order: [{
        type: Schema.Types.ObjectId,
        ref: "Order"
    }]
})

userSchema.plugin(pasportLocalMonggose)
module.exports = mongoose.model("User", userSchema)
