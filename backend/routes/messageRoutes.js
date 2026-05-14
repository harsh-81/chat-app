import express from "express";
import { sendMessage, getMessages, getConversations } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.get("/conversations", protect, getConversations);
router.get("/:receiverId", protect, getMessages);
router.post("/send/:receiverId", protect, upload.single("image"), sendMessage);

export default router;