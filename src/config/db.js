require("dotenv").config();
const mongoose = require("mongoose");

function connectToDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("server is connected to DB");
    })
    .catch(err =>{
        console.log("DB Connection issue");
        process.exit(1);
    })
       
}

module.exports = connectToDB;