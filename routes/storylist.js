const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const methodOverride=require("method-override");
const Story=require("../models/stories.js");
const {storySchemaJoi,reviewSchema}=require("../schema.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
const multer  = require('multer')
const {storage}=require("../CloudConfig.js");
const upload = multer({ storage });

// to valide story
const validateStory=(req,res,next)=> {
    let {error}=storySchemaJoi.validate(req.body);
    if(error) {
        let errmsg=error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else {
        next();
    }
};

// route  to show all the stories in home
router.get("/",
    wrapAsync(async(req,res)=> {
    const allStories= await Story.find({});
    res.render("stories/index.ejs",{allStories});
}));

// route to get new story form
router.get("/new",isLoggedIn,wrapAsync(async(req,res)=> {
    res.render("./stories/new.ejs");
}));

// route to post new story
router.post("/",
    isLoggedIn,
    upload.single("story[img]"),
    validateStory,
    wrapAsync(async(req,res)=> {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);
    let url=req.file.path;
    let filename=req.file.filename;
    let { story } = req.body;
    let newStory = new Story(story);
    newStory.owner=req.user._id;
    newStory.img={url,filename};
    await newStory.save();
    req.flash("success", "New Story Created");
    res.redirect(`/stories/${newStory._id}`);
    }
    
));

//route to get info about any  particular story
router.get("/:id",
    wrapAsync(async(req,res)=> {
    let {id}=req.params;
    const story= await Story.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        }
    }).populate("owner")
    .populate("originalAuthor");
    if(!story ) {
        req.flash("error","Story you are requested for does not exist");
        return res.redirect("/stories");
    }
    res.render("./stories/show.ejs",{story});
}));

//route to get form to create new version of story
router.get("/:id/Remix",
    isLoggedIn,
    wrapAsync(async (req,res)=> {
        let {id}=req.params;
        const story= await Story.findById(id).populate("owner").populate("originalAuthor");
        if(!story) {
        req.flash("error","Story you are requested for does not exist");
        res.redirect("/stories");
    }
    res.render("./stories/newVersion.ejs",{story});
}));

//route to post remix story
router.post("/:id/Remix",
    upload.single("story[img]"),
    validateStory,
    wrapAsync(async(req,res)=> {
    let story= await Story.findById(req.params.id);

    let remixStory=new Story({
        title: req.body.story.title,
        genre: req.body.story.genre,
        tags: req.body.story.tags,
        summary: req.body.story.summary,
        content: req.body.story.content,
        owner: req.user._id,                // new author
        originalAuthor: story.owner._id, // keep original author
        isRemix: true
    });
    if(typeof req.file!=="undefined") {
        let url=req.file.path;
        let filename=req.file.filename;
        remixStory.img={url,filename};
    }else {
        let url=story.img.url;
        let filename=story.img.filename
        remixStory.img={url,filename};
    }
    await remixStory.save();
    console.log(remixStory);
    req.flash("success", "You have created new form of this story!");
    res.redirect(`/stories/${remixStory._id}`); 
}));

//route to get edit form
router.get("/:id/edit",
    isLoggedIn,
    wrapAsync(async(req,res)=> {
    let {id}=req.params;
    const story=await Story.findById(id);
    if(!story) {
        req.flash("error","Story you are requested for does not exist");
        res.redirect("/stories");
    }
    res.render("./stories/edit.ejs",{story});
}));

// route to post edited story
router.put("/:id",
    isLoggedIn,
    isOwner,
    upload.single("story[img]"),
    validateStory,
    wrapAsync(async(req,res)=> {
    let {id}=req.params;
    let story=await Story.findByIdAndUpdate(id,{...req.body.story});
    if(typeof req.file!=="undefined") {
        let url=req.file.path;
        let filename=req.file.filename;
        story.img={url,filename};
        await story.save();
    }
    req.flash("success"," Story Updated ");
    res.redirect(`/stories/${id}`);
}));

//route to delete story
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async(req,res)=> {
    let {id}=req.params;
    let result=await Story.findByIdAndDelete(id);
    req.flash("success","Story Deleted");
    res.redirect("/stories");
}));

module.exports=router;