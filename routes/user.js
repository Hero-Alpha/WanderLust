const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { error } = require("console");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");



// Signup page ------------------------------------------------------------------------
router.get("/signup", (req, res) => {
    res.render("listings/signup.ejs");
});

router.post("/signup", wrapAsync(userController.signup));

// Login page ------------------------------------------------------------------------
router.get("/login", (req, res) => {
    res.render("listings/login.ejs");
});

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {failureRedirect: "/login",failureFlash: true,}),
    userController.login);

// Logout route ------------------------------------------------------------------------
router.get("/logout", userController.logout);


module.exports = router;