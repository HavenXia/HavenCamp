// set up mongoose
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// make schema for camp ground
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    // array of object id (ref) of reviews
    // 这里是mongo relations
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

});

// create the collection and name the model 
const Campground = mongoose.model('Campground', CampgroundSchema);
// export the model
module.exports = Campground;

