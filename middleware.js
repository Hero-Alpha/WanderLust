//middleware to validate the listings

const ExpressError = require("./utils/ExpressError.js")
const {listingSchema} = require("./schema.js");

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        // Log the exact error message
        console.log(error);
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
// ---------------------------------------------------------------------

//middleware to validate reviews


const { reviewSchema } = require("./schema.js");

module.exports.validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next(); 
    }
}

// ---------------------------------------------------------------------

// middleware to make sure the user is logged in

module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req);
    if (!req.isAuthenticated()) {

        // redirect url
        req.session.redirectUrl = req.originalUrl;
        req.flash("edited", "You must be logged in to perform this task");
        return res.redirect("/login");
    }
    next();
}
// ---------------------------------------------------------------------

//middleware to make sure that the page is redirected to the one user want to be at

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        // console.log(res.locals.redirectUrl);
    }
    next();
};

// ---------------------------------------------------------------------

// middleware used for checking if the user trying to make change is the owner of the listing

const listings = require("./models/listing");

module.exports.isOwner = async(req, res, next) =>{
    let { id } = req.params;
    let listing = await listings.findById(id);

    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error", "Permission Denied - Not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// ---------------------------------------------------------------------
