const express = require("express");
const router = express.Router();
const {signup,login,logout,profilePic} = require("../controllers/auth.controller");
const {protectRoute} = require("../middleware/auth.middleware")

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/profilePic",protectRoute, profilePic);

module.exports = router;