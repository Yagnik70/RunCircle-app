
import express from "express";
import {
  adminlogin,
  getAllUsers,
  getAllProfiles,
  deleteProfile,
  toggleUserStatus,
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", adminlogin);

router.get("/users", authMiddleware, getAllUsers);

router.get("/profiles", authMiddleware, getAllProfiles);
router.delete("/profiles/:id", authMiddleware, deleteProfile);

router.put("/users/:id/status", authMiddleware, toggleUserStatus);

export default router;