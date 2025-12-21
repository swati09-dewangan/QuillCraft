const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Story=require("../models/stories.js");
const Review=require("../models/review.js");
const {storySchema,reviewSchema}=require("../schema.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");

// to validate review
let validateReview=(req,res,next)=> {
    let {error}=reviewSchema.validate(req.body);
    if(error) {
        let errmsg=error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else {
        next();
    }
};

//route to post review
router.post("/",
    validateReview,
    isLoggedIn,
    wrapAsync(async(req,res)=> {
    let story=await Story.findById(req.params.id);
    let review=new Review(req.body.review);
    review.author=req.user._id;
    story.reviews.push(review);
    await review.save();
    await story.save();
    req.flash("success","New Review Created");
    res.redirect(`/stories/${story._id}`);
}));

//route to delete review
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async(req,res)=> {
    let {id,reviewId}=req.params;
    await Story.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/stories/${id}`);
}));

module.exports=router;
