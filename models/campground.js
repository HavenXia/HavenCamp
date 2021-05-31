// set up mongoose
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// make schema for camp ground
const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

// create the collection and name the model 
const Campground = mongoose.model('Campground', CampgroundSchema);
// export the model
module.exports = Campground;

