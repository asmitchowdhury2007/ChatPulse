const mongoose = require("mongoose");

async function ConnectionDB(url){
    return await mongoose.connect(url);
}
module.exports ={
    ConnectionDB,
}