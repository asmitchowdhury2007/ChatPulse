const bcrypt = require("bcryptjs");
const user = require("../models/user");
const {generateToken} = require("../lib/utils");
require("dotenv").config();
const {sendEmail} = require("../email/emailHandler")

async function signup(req,res){
    const {fullname,email,password} = req.body;
    const fullnameRegex = /^[a-zA-Z\s]{3,50}$/;
    const emailRegex    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!fullname || !email || !password){
        return res.status(400).json({message : "All fields are required"});
    }
    if(!fullnameRegex.test(fullname)){
        return res.status(400).json({message : "Full name must be 3–50 characters, letters and spaces only"});
    }
    if(!emailRegex.test(email)){
        return res.status(400).json({message : "Invalid email format"});
    }
    if(!passwordRegex.test(password)){
        return res.status(400).json({message : "Password must be 8+ chars with uppercase, lowercase, number and special character"});
    }
    let User = await user.findOne({email});
    if(User){
        return res.status(400).json({message : "Email already exists"});
    }
    else{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = await user.create({
            fullname:fullname.trim(),
            email,
            password : hashedPassword
        })
        if(newUser){
            const token = generateToken(newUser._id);
            res.cookie("uid",token,{
                maxAge : 7*24*60*60*1000,
                httpOnly: true,         
                secure:process.env.NODE_ENV==="production",       
                sameSite: "strict"
            });
            await sendEmail(newUser.fullname, newUser.email);
            return res.status(201).json({
                _id : newUser._id,
                email : newUser.email,
                profilePic : newUser.profilePic,
            })
        }
        else{
            return res.status(400).json({message:"Invalid User Data"});
        }
    }
    
    
}

async function login (req,res){
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).json({message:"Email and Password are required"});
    const User = await user.findOne({email});
    if (!User) return res.status(400).json({message:"Invalid Credentials"});
    else{
        const isPasswordMatched = await bcrypt.compare(password, User.password);
        if(! isPasswordMatched) return res.status(400).json({message:"Invalid Credentials"});
        const token = generateToken(User._id);
        res.cookie("uid",token,{
            maxAge : 7*24*60*60*1000,
            httpOnly: true,         
            secure:process.env.NODE_ENV==="production",       
            sameSite: "strict"
        });
        return res.status(201).json({
            _id : newUser._id,
            email : newUser.email,
            profilePic : newUser.profilePic,
        })
        
    }

}

async function logout (req,res){
    res.clearCookie("uid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    return res.status(200).json({ message: "Logged out successfully" });

}


module.exports = {
    signup,
    login,
    logout,
}