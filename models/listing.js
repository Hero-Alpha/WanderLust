const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { ref } = require("joi");

const listingSchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

module.exports = mongoose.model("Listing", listingSchema);
