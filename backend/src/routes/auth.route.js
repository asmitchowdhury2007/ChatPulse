import express from "express";
const router = express.Router();
import {signup,login,logout,profilePic} from "../controllers/auth.controller.js";
import {protectRoute}  from "../middleware/auth.middleware.js";
import {arcjetProtection} from "../middleware/arcjet.middleware.js"

router.use(arcjetProtection);


router.post("/signup",arcjetProtection,signup);
router.post("/login",arcjetProtection,login);
router.post("/logout",logout);
router.put("/profilePic",protectRoute, profilePic);

export default router;