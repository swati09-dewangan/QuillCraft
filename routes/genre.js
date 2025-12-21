const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const methodOverride=require("method-override");
const Story=require("../models/stories.js");
const {storySchema,reviewSchema}=require("../schema.js");

// route for adventure theme
router.get("/Adventure", async(req,res)=> {
    let stories= await Story.find({genre:"Adventure"});
    res.render("./genre/Adventure.ejs",{stories});
});

// route for Mystery theme
router.get("/Mystery", async(req,res)=> {
    let stories= await Story.find({genre:"Mystery"});
    res.render("./genre/Mystery.ejs",{stories});
});

// route for SciFiction theme
router.get("/SciFiction", async(req,res)=> {   
    let stories= await Story.find({genre:"Sci-Fi"});
    res.render("./genre/SciFiction.ejs",{stories});
});

// route for Thriller theme
router.get("/Thriller", async(req,res)=> {   
    let stories= await Story.find({genre:"Thriller"});
    res.render("./genre/Thriller.ejs",{stories});
});

// route for romance theme
router.get("/Romance", async(req,res)=> {   
    let stories= await Story.find({genre:"Romance"});
    res.render("./genre/Romance.ejs",{stories});
});

// route for drama theme
router.get("/Drama", async(req,res)=> {   
    let stories= await Story.find({genre:"Drama"});
    res.render("./genre/Drama.ejs",{stories});
});

// route for fantasy theme
router.get("/Fantasy", async(req,res)=> {   
    let stories= await Story.find({genre:"Fantasy"});
    res.render("./genre/Fantasy.ejs",{stories});
});

module.exports=router;