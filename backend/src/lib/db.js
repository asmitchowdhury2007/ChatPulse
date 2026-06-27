import mongoose from "mongoose";

async function ConnectionDB(url){
    return await mongoose.connect(url);
}
export{
    ConnectionDB,
}