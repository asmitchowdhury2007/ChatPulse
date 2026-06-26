const jwt = require("jsonwebtoken");
require("dotenv").config();


function generateToken(id){
    return jwt.sign({id},process.env.JWT_Secret,{
        expiresIn :"7d"
    });
    
}

module.exports = {
    generateToken,
}