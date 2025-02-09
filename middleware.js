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

//middleware to make sure that the page is redirected to the one user want to be at
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        // console.log(res.locals.redirectUrl);
    }
    next();
};