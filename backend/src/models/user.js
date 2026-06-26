const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname :{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength : 9,
    },
    profilePic :{
        type:String,
        default:""
    }
},
{
    timestamps:true,
});

const user = mongoose.model("users",userSchema);
module.exports = user;