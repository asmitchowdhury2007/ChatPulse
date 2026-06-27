import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();


function generateToken(id){
    return jwt.sign({id},process.env.JWT_Secret,{
        expiresIn :"7d"
    });
    
}

function verifyToken(token){
    const decoded = jwt.verify(token,process.env.JWT_Secret);
    if(decoded){
        return dedoced;
    }
    
    
}

export{
    generateToken,
    verifyToken,
}