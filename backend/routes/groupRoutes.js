import express from "express";
import {
  createGroup,
  getGroupDetails,
  addMember,
  removeMember,
  leaveGroup,
  deleteGroup,
  updateGroup,
} from "../controllers/groupController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.post("/create", protect, upload.single("groupAvatar"), createGroup);
router.get("/:groupId", protect, getGroupDetails);
router.put("/:groupId/update", protect, upload.single("groupAvatar"), updateGroup);
router.put("/:groupId/add-member", protect, addMember);
router.put("/:groupId/remove-member", protect, removeMember);
router.put("/:groupId/leave", protect, leaveGroup);
router.delete("/:groupId/delete", protect, deleteGroup);

export default router;