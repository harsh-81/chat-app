import express from "express";
import {
  sendMessage,
  getMessages,
  getConversations,
  getUnreadCount,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// ✅ specific routes first
router.get("/conversations", protect, getConversations);
router.get("/unread-count", protect, getUnreadCount);

// ✅ parameterized routes after
router.get("/:receiverId", protect, getMessages);
router.post("/send/:receiverId", protect, upload.single("image"), sendMessage);

export default router;