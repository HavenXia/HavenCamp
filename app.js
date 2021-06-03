// packages 
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
// package for layout
const ejsMate = require('ejs-mate')

// require the method-override
const methodOverride = require('method-override')

// require the campground model 
const Campground = require('./models/campground')

// export the ExpressError class and catchAsync function
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

// sechema validation in js
const Joi = require('joi')

// connect to database
mongoose.connect('mongodb://localhost:27017/haven-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

// check connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);

// set ejs path
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// parse method
app.use(express.urlencoded({ extended: true }));
// override configuration
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
})

// index operation: show all campgrounds
app.get('/campgrounds', catchAsync(async (req, res) => {
    // get an array of all campgrounds
    const campgrounds = await Campground.find({});
    // render the array to ejs (views/campgrounds/index.ejs)
    res.render('campgrounds/index', { campgrounds });
}))


// new form operation
// must before show operation to make sure the order is right
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

// add the new documents into db
app.post('/campgrounds', catchAsync(async (req, res) => {

    // server side validation - 防止有人从postman发送request
    // use JOI schema but not Mongo schema to validate
    const compgroundSchema = Joi.object({
        // campground是required的object, 确保这个object存在于req.body
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required.min(0),
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required()
        }).required()
    })

    // then validate the req.body
    const { error } = compgroundSchema.validate(req.body);
    // if error, use the detail to create ExpressError and catch it
    if (error) {
        // detail is an array of object, combine them as a string
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }

    // cast to Campground
    // 这里加上campground是因为ejs里面写的是campground[title]
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    // redirect with id
    res.redirect(`/campgrounds/${newCampground._id}`)
}))


// show operation
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    // get the id from input
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // render the found campground to ejs
    res.render('campgrounds/show', { campground })
}))



// edit form operation, the order matters
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    // get the id from input
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // render the found campground to ejs
    res.render('campgrounds/edit', { campground })
}))

// put method to update campground
app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    // get id
    const { id } = req.params;
    // update the dpcument with req.body.campground (是个object)
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`)
}))


// delete operation
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`)
}))

// all request that cannot match above will be handled by this!
// 这种情况就抛出404 error, 这里不是async, 所以需要自己next()
app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})

// error handler
app.use((err, req, res, next) => {
    //  destructure 提取statusCode, 如果不存在就设置500
    const { statusCode = 500 } = err;
    // 设置err object本身的default 
    if (!err.message) err.message = 'Oh no, Something Went Wrong!';
    // res设置status后render error 到error.ejs
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log("listening")
})
