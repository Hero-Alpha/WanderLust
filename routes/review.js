const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validateReview } = require("../middleware.js");
const router = express.Router({mergeParams: true});


// ---------------------------------------------------------------------

// REVIEW MANAGEMENT

//POST REVIEW ROUTE("/listings/:id/reviews"): to post reviews
router.post("/",validateReview, wrapAsync(async(req,res)=>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

// DELETE REVIEW ROUTE("/listings/:id/reviews/:rediew._id") 
router.delete("/:reviewId", wrapAsync(async(req, res)=>{
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;