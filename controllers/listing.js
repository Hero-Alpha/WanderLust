const listing = require("../models/listing");
const Listing = require("../models/listing");


// -----------------------------------------------------------------------------------------------------------------------------------------
// INDEX ROUTE CALL

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});

    if (!allListings) {
        req.flash("error", "Lisitng you requested does not exist")
    }

    res.render("listings/index.ejs", { allListings });
}

// -----------------------------------------------------------------------------------------------------------------------------------------
// CREATE ROUTE CALL

module.exports.create = async (req, res, next) => {
    console.log("UPLOAD RESPONSE:", req.file); 
    let url = req.file.path;
    let filename = req.file.filename;

    if (!url) {
        return res.status(400).send("Image upload failed!");
    }

    let listing = req.body.listing;
    listing.owner = req.user._id;
    listing.image = { url, filename };

    let newListing = new Listing(listing);
    await newListing.save();
    
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};



// -----------------------------------------------------------------------------------------------------------------------------------------
// UPDATE ROUTE CALL

//to check if the record is present or not
module.exports.check = async (req, res) => {
    let { id } = req.params;
    let listingData = await Listing.findById(id);
    if (!listingData) {
        req.flash("error", "Lisitng you requested does not exist")
        res.redirect("/listings");
    }

    //rendering a downgraded image of the original image
    let originalImageUrl = listingData.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_270");

    res.render("listings/edit", { listingData, originalImageUrl });
}

//to update the data after verification
module.exports.update = async (req, res) => {
    let { id } = req.params;
    console.log(req.body);

    let updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if( typeof(req.file) != "undefined" ){
        let url = req.file.path;
        let filename = req.file.filename;
    
        updatedListing.image = { url,filename };
        await updatedListing.save();
    }

    req.flash("edited", "Listing Edited");
    res.redirect("/listings");
}

// -----------------------------------------------------------------------------------------------------------------------------------------
//DELETE ROUTE CALL

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("deleted", "Listing Deleted");
    res.redirect("/listings");
}

// -----------------------------------------------------------------------------------------------------------------------------------------
//SHOW ROTUTE CALL

module.exports.show = async (req, res) => {
    let { id } = req.params;
    console.log(id);
    let listingData = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    
    console.log(listingData);
    res.render("listings/show.ejs", { listingData });
}

// -----------------------------------------------------------------------------------------------------------------------------------------