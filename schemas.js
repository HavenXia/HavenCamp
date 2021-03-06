const Joi = require('joi')

// server side validation - 防止有人从postman发送request
// use JOI schema but not Mongo schema to validate
// this validation happen at server-side but before been processed by handler

module.exports.campgroundSchema = Joi.object({
    // campground是required的object, 确保这个object存在于req.body
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

// JOI schema for reviews
module.exports.reviewSchema = Joi.object({
    // 这个object必须存在
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})