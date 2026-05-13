import express from "express";
import { register, login, logout, refreshToken } from "../controllers/authController.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// upload.single("avatar") runs before register
// "avatar" must match the field name you send from the frontend
router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh", refreshToken);

export default router;