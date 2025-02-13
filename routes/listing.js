const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js")
const listingController = require("../controllers/listing.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { storage } = require("../cloudConfig.js")
const multer = require("multer");
const upload = multer({storage});

const router = express.Router();
exports.router = router;


// ---------------------------------------------------------------------
//INDEX ROUTE ("/listings")
// to show all the listings in the database

router.get("/", wrapAsync(listingController.index));

// --------------------------------------------------------------------------
//CREATE ROUTE("/listings/new")
//to create and save new data on site

router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new");
});


router.post("/",isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.create));


// --------------------------------------------------------------------------
//EDIT  - UPDATE ROUTE("listings/:id/edit")

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.check));

router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"),
            validateListing, wrapAsync(listingController.update));

// --------------------------------------------------------------------------
//DELETE ROUTE("/listings/:id")

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.delete));

// --------------------------------------------------------------------------
//SHOW ROUTE ("/listings/:id")
//to navigate to a particular listing in the data

router.get("/:id", wrapAsync(listingController.show));

// --------------------------------------------------------------------------

module.exports = router;