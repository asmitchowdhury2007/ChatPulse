import express from "express";
const router = express.Router();
import {signup,login,logout,profilePic,checkAuth} from "../controllers/auth.controller.js";
import {protectRoute}  from "../middleware/auth.middleware.js";
import {arcjetProtection} from "../middleware/arcjet.middleware.js"

router.use(arcjetProtection);


router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.put("/profilePic",protectRoute, profilePic);

router.get("/check",protectRoute, checkAuth);

export default router;