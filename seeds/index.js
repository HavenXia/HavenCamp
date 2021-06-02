/*
seperate js to control the database
*/

// configurations 
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

// require the campground model 
const Campground = require('../models/campground')

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

// function that take an array and return random element
// used for places, descriptors
const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

// clear the collection and insert purple field
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        // random city in cities(array)
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        // take random city and construct the campground
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://api.pixivweb.com/api.php?return=img',
            description: 'random description',
            price: price
        });
        await camp.save();
    }
}

// close connection between node & mongo after seedDB
seedDB().then(() => {
    mongoose.connection.close();
})