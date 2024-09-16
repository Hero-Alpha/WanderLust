const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const { title } = require("process");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")

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
    console.log("Server listnening to port 8080");
});


// ---------------------------------------------------------------------
//INDEX ROUTE ("/listings")
// to show all the listings in the database

app.get("/listings", async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{ allListings });
});

// --------------------------------------------------------------------------
//CREATE ROUTE("/listings/new")
//to create and save new data on site

app.get("/listings/new", (req, res) => {
    res.render("listings/new"); 
});


app.post("/listings", wrapAsync(async(req,res,next)=>{
        let listing = req.body.listing;
        let newListing = new Listing(listing);
        await newListing.save();
        res.redirect("/listings");
    })
    
);


// --------------------------------------------------------------------------
//EDIT  - UPDATE ROUTE("listings/:id/edit")

app.get("/listings/:id/edit", async(req,res)=>{
    let { id } = req.params;
    console.log(id);
    let listingData = await Listing.findById(id);
    res.render("listings/edit",{ listingData });
});

app.put("/listings/:id", async(req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
});

// --------------------------------------------------------------------------
//DELETE ROUTE("/listings/:id")

app.delete("/listings/:id", async(req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});


// --------------------------------------------------------------------------
//SHOW ROUTE ("/listings/:id")
//to navigate to a particular listing in the data

app.get("/listings/:id", async(req,res)=>{
    let { id } = req.params;
    console.log(id);
    let listingData = await Listing.findById(id);
    res.render("listings/show.ejs",{ listingData });
});

// --------------------------------------------------------------------------
// Custom error handler
app.use((err, req, res, next)=>{
    res.send("Something went wrong")
});

// --------------------------------------------------------------------------
//BASIC API
app.get("/",(req, res)=>{
    res.send("Server request accepted");
});