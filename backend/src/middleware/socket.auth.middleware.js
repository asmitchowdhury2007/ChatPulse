import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import user from "../models/user.js"
import {verifyToken} from "../lib/utils.js"
import cookie from "cookie";

async function SocketAuthMiddleware(socket,next){
    
    try{
        const cookies = cookie.parse(socket.handshake.headers.cookie || "");
        console.log("Handshake Cookies:", socket.handshake.headers.cookie);
        const token = cookies.uid;
        if(!token) return next(new Error("Unauthorised"));
        const decoded = verifyToken(token);
        if(decoded){
            const User = await user.findById(decoded.id).select("-password");
            if(!User) return next(new Error("User Not Found"));
            socket.user = User;
            socket.userId = User._id.toString();
           
            next()

        }
        else{
            return next(new Error("Invalid Token"))
        }

    }catch(err){
        
        next(new Error("Unauthorised - Authentication Failed"));
    }
    
}

export {
    SocketAuthMiddleware,
}