const User = require("../models/user");

//-----------------------------------------------------------------------------------------------------------------
// SIGNUP PAGE CALL 
module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(error)=>{
            if(error){
                return next(error);
            }
        });
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

//-----------------------------------------------------------------------------------------------------------------
// LOGIN PAGE CALL
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
}

//-----------------------------------------------------------------------------------------------------------------
// LOGOUT CALL

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You have been logged out!");
        res.redirect("/listings");
    });
}

//-----------------------------------------------------------------------------------------------------------------