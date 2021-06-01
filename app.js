// configurations 
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

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


app.get('/', (req, res) => {
    res.render('home')
})

// index operation: show all campgrounds
app.get('/campground', async (req, res) => {

    // get an array of all campgrounds
    const campgrounds = await Campground.find({});
    // render the array to ejs
    res.render('campgrounds/index', campgrounds);
})

app.listen(3000, () => {
    console.log("listening")
})
