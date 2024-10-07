const express = require("express");
const mongoose = require("mongoose");
const { title } = require("process");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const app = express();
const port = 8080;

app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

//DATABASE CONNECTION
main()
    .then(()=>{
        console.log("Database connected");
    })
    .catch((err)=> console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.listen(8080, ()=>{
    console.log("Server listening to port 8080");
});


// ---------------------------------------------------------------------
// Schema validation handler
const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next(); 
    }
}

// ---------------------------------------------------------------------
// Review validation handler
const validateReview = (req,res,next)=>{
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
//INDEX ROUTE ("/listings")
// to show all the listings in the database

app.get("/listings", wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{ allListings });
}));

// --------------------------------------------------------------------------
//CREATE ROUTE("/listings/new")
//to create and save new data on site

app.get("/listings/new", (req, res) => {
    res.render("listings/new"); 
});


app.post("/listings",validateListing, wrapAsync(async(req,res,next)=>{
        let listing = req.body.listing;
        let newListing = new Listing(listing);
        await newListing.save();
        res.redirect("/listings");
    })
    
);


// --------------------------------------------------------------------------
//EDIT  - UPDATE ROUTE("listings/:id/edit")

app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
    let { id } = req.params;
    console.log(id);
    let listingData = await Listing.findById(id);
    res.render("listings/edit",{ listingData });
}));

app.put("/listings/:id",validateListing, wrapAsync(async(req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
}));

// --------------------------------------------------------------------------
//DELETE ROUTE("/listings/:id")

app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


// --------------------------------------------------------------------------
//SHOW ROUTE ("/listings/:id")
//to navigate to a particular listing in the data

app.get("/listings/:id", wrapAsync(async(req,res)=>{
    let { id } = req.params;
    console.log(id);
    let listingData = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{ listingData });
}));

// --------------------------------------------------------------------------
// REVIEW MANAGEMENT
//POST ROUTE("/listings/:id/reviews"): to post reviews
app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));







// --------------------------------------------------------------------------
// General error responder
app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "Page Not Found!"));
});

// --------------------------------------------------------------------------
// Custom error handler
app.use((err, req, res, next)=>{
    let { statusCode=500,message="Something Went Wrong!" } = err;
    res.render("listings/error.ejs",{statusCode,message});
});

// --------------------------------------------------------------------------
//BASIC API
app.get("/",(req, res)=>{
    res.send("Server request accepted");
});