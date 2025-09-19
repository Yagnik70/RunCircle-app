import express from "express";
import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploads from "../middleware/uploadMiddleware.js";
const router = express.Router();
router.post(
  "/profile",
  authMiddleware,
  uploads.single("profile_img"),
  createProfile
);
router.get("/profile", authMiddleware, getProfile);
router.put(
  "/profile",
  authMiddleware,
  uploads.single("profile_img"),
  updateProfile
);
router.delete("/profile", authMiddleware, deleteProfile);
export default router;
