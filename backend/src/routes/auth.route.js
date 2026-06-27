import express from "express";
const router = express.Router();
import {signup,login,logout,profilePic} from "../controllers/auth.controller.js";
import {protectRoute}  from "../middleware/auth.middleware.js";

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/profilePic",protectRoute, profilePic);

export default router;