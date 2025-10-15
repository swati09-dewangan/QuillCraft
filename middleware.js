const Story=require("./models/stories.js");
const {storySchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");
const Review=require("./models/review.js");
const review = require("./models/review.js");

// to check whether user is logged in or not
module.exports.isLoggedIn=(req,res,next)=> {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
        req.flash("you must be logged in to write new story");
        return res.redirect("/login");
    }
    next();
};

// after login switch to page where left
module.exports.saveRedirectUrl=(req,res,next)=> {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

// to check whether user is stories owner or not
module.exports.isOwner= async(req,res,next)=> {
    let {id}=req.params;
    let story= await Story.findById(id);
    await Story.findByIdAndUpdate(id,{...req.body.story});
    if(!res.locals.currUser && res.locals.currUser._id.equals(story.owner._id)) {
        req.flash("error","you are not the owner of this listing");
        return res.redirect(`/stories/${id}`);
    }
    next();
}

// to check reviews author
module.exports.isReviewAuthor=async(req,res,next)=> {
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    await Review.findByIdAndUpdate(id,{...req.body.story});
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error","you are not the author of this review");
        return res.redirect(`/stories/${id}`);
    }
    next();
}