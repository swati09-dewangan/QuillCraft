if(process.env.Node_ENV !="production") {
    require('dotenv').config()
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const methodOverride=require("method-override");
const Story=require("./models/stories.js");
const Review=require("./models/review.js");
const User=require("./models/user.js");
const story=require("./routes/storylist.js"); 
const genre=require("./routes/genre.js");
const review=require("./routes/review.js");
const user=require("./routes/user.js"); 
const search=require("./routes/search.js");
const session =require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

// const mongo_URL="mongodb://127.0.0.1:27017/QuillCraft";
const dbUrl=process.env.ATLASDB_URL;
// code to connect with mongoose
async function main() {
    await mongoose.connect(mongo_URL)
}

main().then(()=> {
    console.log("connected to db");
}).catch((err)=> {
    console.log(err);
});

const store=MongoStore.create({
    mongo_Url:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})

// to store session info
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

// to use the session facility
app.use(session(sessionOptions));
app.use(flash());// to notify the updation for secs

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());// start session
passport.deserializeUser(User.deserializeUser());//end session

app.use((req,res,next)=> {
    res.locals.success=req.flash("success");//if operation occured successfully
    res.locals.error=req.flash("error");//if operation failed
    res.locals.currUser=req.user;//to assign req.user as current user
    next();
});

app.use("/",search); //for searching user and story
app.use("/",user); //for signup and login for user
app.use("/stories",genre); // to get genre wise story
app.use("/stories",story);// to perform post,put and delete operation on story
app.use("/stories/:id/reviews",review);// to post and delete review 

// to show error for the page if not found
app.all("*",(req,res,next)=> {
    next(new ExpressError(404,"page not found"));
});

// to show the error directly to page
app.use("*",(err,req,res,next)=> {
    const {statusCode=500,message="something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
});

// to connect with localhost 
app.listen(8080,()=> {
    console.log("Listening to port 8080");
});