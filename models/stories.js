const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review");
const storySchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    genre:{
        type:String,
        required:true,
    },
    summary:String,
    content:{
        type:String,
        required:true,
    },
    tags:{
        type: String,
        set: v => Array.isArray(v) ? v.join(","): v, 
    },
    img: {
        url:String,
        filename:String,
    },
    status:{
        type:String,
    },
    language:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    originalAuthor:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    isRemix: {
        type:Boolean,
        default:false,
    }
});

module.exports=mongoose.model("Story",storySchema);
