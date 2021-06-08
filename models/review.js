// set up mongoose
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// 添加留评论的功能
// schema for review
const reviewSchema = new Schema({
    body: String,
    rating: Number
})

module.exports = mongoose.model("Review", reviewSchema)
