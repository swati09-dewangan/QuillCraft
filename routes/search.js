const express = require('express');
const router = express.Router();
const Story = require('../models/stories'); 
const User  = require('../models/user');
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");


router.get("/search", wrapAsync(async(req,res)=> {
    const searchTerm=req.query.q || "";
    try {
        const regex= new RegExp(searchTerm,"i");// using regular expression to search
        const[stories,users]= await Promise.all([
            Story.find({title:regex}),
            User.find({username:regex})
        ]);

        res.render("./SearchResults",{stories,users,searchTerm});
    }catch(err) {
        console.error(err);
        req.flash("error",e.message);
    }
}));

module.exports=router;