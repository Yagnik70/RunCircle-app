import express from "express";
import {
  adminlogin,
  getAllUsers,
  getAllProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploads from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Admin Login
router.post("/login", adminlogin);

// Users
router.get("/users", authMiddleware, getAllUsers);

// Profiles
router.get("/profiles", authMiddleware, getAllProfiles);
router.post(
  "/profiles",
  authMiddleware,
  uploads.single("profile_img"),
  createProfile
);
router.put(
  "/profiles/:id",
  authMiddleware,
  uploads.single("profile_img"),
  updateProfile
);
router.delete("/profiles/:id", authMiddleware, deleteProfile);

export default router;
