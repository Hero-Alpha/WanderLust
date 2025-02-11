const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js")
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");
const router = express.Router({mergeParams: true});
const reviewController = require("../controllers/review.js");

exports.router = router;



// ---------------------------------------------------------------------
// REVIEW MANAGEMENT

//POST REVIEW ROUTE("/listings/:id/reviews"): to post reviews
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.post));


// DELETE REVIEW ROUTE("/listings/:id/reviews/:rediew._id") 
router.delete("/:reviewId",isLoggedIn, isAuthor, wrapAsync(reviewController.delete));

module.exports = router;

// ---------------------------------------------------------------------