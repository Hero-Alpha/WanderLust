const express = require("express");
const router = express.Router();

router.get("/signup",(req,res)=>{
    res.render("listings/signup.ejs");
});

module.exports = router;