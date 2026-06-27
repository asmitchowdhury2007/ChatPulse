const {verifyToken} = require("../lib/utils")
const user = require("../models/user");

async function protectRoute(req,res,next){
    const token = req.cookie.uid;
    if(token){
        const decoded = verifyToken(token);
        if(dedoced){
            const User = await user.findById(decoded.id).select("-password");
            if(!User) return res.status(401).json({ message: "User no longer exists" });
            req.user = User;
            next();

        }
        else{
            return res.status(401).json({ message: "Unauthorised" });
        }
    }
    else{
        return res.status(401).json({ message: "Unauthorised" });
    }
}
module.exports ={
    protectRoute,
}