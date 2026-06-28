import express from "express";
const router = express.Router();
import {getAllContacts,chatPartners,getMessageByID,sendMessage} from "../controllers/message.controller.js"
import {protectRoute} from "../middleware/auth.middleware.js"
import {arcjetProtection} from "../middleware/arcjet.middleware.js"

router.use(arcjetProtection,protectRoute);

router.get("/contacts" , getAllContacts),
router.get("/chat", chatPartners),
router.get("/:id", getMessageByID);

router.post("/send/:id",sendMessage);


export default router;
