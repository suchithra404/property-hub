import express from "express";
import {
  sendMessage,
  getMessages,
  getMyMessages,
} from "../controllers/contact.controller.js";



import { verifyToken, verifyAdmin } from "../utils/verifyUser.js";



const router = express.Router();

// User sends message
router.post("/send", verifyToken, sendMessage);

router.get("/my", verifyToken, getMyMessages);


// Admin sees messages
router.get("/all", verifyToken, verifyAdmin, getMessages);



export default router;
