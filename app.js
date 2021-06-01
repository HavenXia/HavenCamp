// configurations 
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

// require the method-override
const methodOverride = require('method-override')

// require the campground model 
const Campground = require('./models/campground')

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
app.get('/campgrounds', async (req, res) => {
    // get an array of all campgrounds
    const campgrounds = await Campground.find({});
    // render the array to ejs (views/campgrounds/index.ejs)
    res.render('campgrounds/index', { campgrounds });
})

// new form operation
// must before show operation to make sure the order is right
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

// add the new documents into db
app.post('/campgrounds', async (req, res) => {
    // cast to Campground
    // 这里加上campground是因为ejs里面写的是campground[title]
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    // redirect with id
    res.redirect(`/campgrounds/${newCampground._id}`)
})

// show operation
app.get('/campgrounds/:id', async (req, res) => {
    // get the id from input
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // render the found campground to ejs
    res.render('campgrounds/show', { campground })
})

// edit form operation, the order matters
app.get('/campgrounds/:id/edit', async (req, res) => {
    // get the id from input
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // render the found campground to ejs
    res.render('campgrounds/edit', { campground })
})

// put method to update campground
app.put('/campgrounds/:id', async (req, res) => {
    // get id
    const { id } = req.params;
    // update the dpcument with 
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
})

// app.put('/campgrounds/:id', async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
//     res.redirect(`/campgrounds/${campground._id}`)
// });



app.listen(3000, () => {
    console.log("listening")
})
