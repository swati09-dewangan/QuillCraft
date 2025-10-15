const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {saveRedirectUrl,isLoggedIn}=require("../middleware.js");
const passport=require("passport");
const User=require("../models/user.js");


// signup form
router.get("/signup",(req,res)=> {
    res.render("./users/signup.ejs");
})

//account creation
router.post("/signup", async (req,res)=> {
    try {
        let {username,email,password}=req.body;
        const newUser= new User({email,username});
        const regiteredUser=await User.register(newUser,password);
        console.log(regiteredUser);
        req.login(regiteredUser,(err)=> {
            if(err) {
                console.log(err);
                return next(err);
            }
            req.flash("success","Welcome to QuillCraft");
            res.redirect("/stories");
        });
    }catch(e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
});

// login form
router.get("/login",(req,res)=> {
    res.render("./users/login.ejs");
});

// logged in website
router.post("/login",saveRedirectUrl,passport.authenticate("local",{ failureRedirect: '/login',failureFlash:true }),wrapAsync(async (req,res)=> {
    req.flash("success","welcome back to QuillCraft");
    let redirectUrl=res.locals.redirectUrl || "/stories";
    res.redirect(redirectUrl);
}));


// logout
router.get("/logout",(req,res,next)=> {
    req.logOut((err)=> {
        if(err) {
            return next(err);
        }
        req.flash("success","you have logged out now");
        res.redirect("/stories");
    })
})
module.exports=router;