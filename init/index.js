const mongoose=require("mongoose");
const initData=require("./data.js");
const Story=require("../models/stories.js");

const mongo_URL="mongodb://127.0.0.1:27017/QuillCraft";
async function main() {
    await mongoose.connect(mongo_URL)
}

main().then(()=> {
    console.log("connected to db");
}).catch((err)=> {
    console.log(err);
});

// to enter the data in database
const initDB= async ()=> {
    await Story.deleteMany();
    initData.data=initData.data.map((obj)=>({...obj,owner:"68c782d4d08796b9851b4024"}));
    await Story.insertMany(initData.data);
};

initDB();