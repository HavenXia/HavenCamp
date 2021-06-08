// set up mongoose
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review')

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

// this middleware will be called by each findByIdAndDelete()!
// post 代表在delete camp之后, 才做的动作, 这里的campground就是被删除的camp
CampgroundSchema.post('findOneAndDelete', async (campground) => {
    // 如果确实删除了
    if (campground) {
        // 删除Review db里面的符合这些id的review
        await Review.remove({
            _id: {
                $in: campground.reviews
            }
        })
    }
})



// create the collection and name the model 
const Campground = mongoose.model('Campground', CampgroundSchema);
// export the model
module.exports = Campground;

