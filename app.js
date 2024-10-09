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

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

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
// Redirecting to the listing router

app.use("/listings",listings);

// ---------------------------------------------------------------------
// Redirecting to the listing router

app.use("/listings/:id/reviews",reviews);

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