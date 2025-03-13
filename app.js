if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js");

const app = express();

app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

// ---------------------------------------------------------------------
//DATABASE CONNECTION
const dbUrl = process.env.MONGO_ATLAS_URL;

main()
    .then(()=>{
        console.log("Database connected");
    })
    .catch((err)=> console.log(err));

    async function main() {
    await mongoose.connect(dbUrl);
}

const port = 3040;
app.listen(port, ()=>{
    console.log(`Server listening to port ${port}`);
});


// ---------------------------------------------------------------------
// Adding sessions

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
        touchAfter: 24*3600,
    }
})

store.on("error", (err) => {
    console.error("ERROR IN MONGO SESSION:", err);
});



const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized : true,
    cookie:{
        expires: Date.now() + 7 * 25 * 60 * 60 * 1000,
        maxAge: 7 * 25 * 60 * 60 * 1000,
        httpOnly: true
    },
};

app.use(session(sessionOptions));
app.use(flash());

// ---------------------------------------------------------------------
// Setting up session for authentication

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// ---------------------------------------------------------------------


// ---------------------------------------------------------------------
// middleware for message flash
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.deleted = req.flash("deleted");
    res.locals.edited = req.flash("edited");
    res.locals.currentUser = req.user;
    next();
});


// ---------------------------------------------------------------------
// Redirecting to the listing router

app.use("/listings",listingRouter);

// ---------------------------------------------------------------------
// Redirecting to the review router

app.use("/listings/:id/reviews",reviewRouter);

// --------------------------------------------------------------------------
// Redirecting to the user router

app.use("/",userRouter);

// ----------------------------------------------------------------------

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