const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const router = express.Router();


// ---------------------------------------------------------------------
// Schema validation handler
// const validateListing = (req, res, next)=>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el)=> el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }
//     else{
//         next(); 
//     }
// }

// ---------------------------------------------------------------------
//INDEX ROUTE ("/listings")
// to show all the listings in the database

router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});

    if (!allListings) {
        req.flash("error", "Lisitng you requested does not exist")
    }

    res.render("listings/index.ejs", { allListings });
}));

// --------------------------------------------------------------------------
//CREATE ROUTE("/listings/new")
//to create and save new data on site

router.get("/new", isLoggedIn, (req, res) => {

    res.render("listings/new");
});


router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    let listing = req.body.listing;
    listing.owner = req.user._id;
    let newListing = new Listing(listing);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
})

);


// --------------------------------------------------------------------------
//EDIT  - UPDATE ROUTE("listings/:id/edit")

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;

    // console.log(req.body);

    let listingData = await Listing.findById(id);
    if (!listingData) {
        req.flash("error", "Lisitng you requested does not exist")
    }
    res.render("listings/edit", { listingData });
}));

router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;

    console.log(req.body);

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("edited", "Listing Edited");
    res.redirect("/listings");
}));

// --------------------------------------------------------------------------
//DELETE ROUTE("/listings/:id")

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("deleted", "Listing Deleted");
    res.redirect("/listings");
}));


// --------------------------------------------------------------------------
//SHOW ROUTE ("/listings/:id")
//to navigate to a particular listing in the data

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    let listingData = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate:{
                path : "author",
            },
        })
        .populate("owner");

    console.log(listingData);
    res.render("listings/show.ejs", { listingData });
}));

// --------------------------------------------------------------------------

module.exports = router;