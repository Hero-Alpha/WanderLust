const Review = require("../models/review");
const Listing = require("../models/listing");

// ---------------------------------------------------------------------
//CREATE REVIEW CALL

module.exports.post = async(req,res)=>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}

// ---------------------------------------------------------------------
//DELETE REVIEW CALL

module.exports.delete = async(req, res)=>{
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review has been successfully deleted");
    res.redirect(`/listings/${id}`);
}
// ---------------------------------------------------------------------
