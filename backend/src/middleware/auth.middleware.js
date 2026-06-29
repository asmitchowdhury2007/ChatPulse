import {verifyToken} from"../lib/utils.js"
import user from"../models/user.js";

async function protectRoute(req,res,next){
    
    const token = req.cookies.uid;
    

    
    
    if(token){
        const decoded = verifyToken(token);
        if(decoded){
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
export{
    protectRoute,
}