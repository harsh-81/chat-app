import express from "express";
import { getMe, getAllUsers, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.get("/", protect, getAllUsers);
router.put("/update", protect, updateProfile);

export default router;