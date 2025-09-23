import express from "express";
import { 
  startActivity, 
  addPoint, 
  stopActivity, 
  getUserActivities,
  getAllActivities,
  deleteActivity   // ✅ new controller import
} from "../controllers/activityController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js"; 

const router = express.Router();

// Existing routes
router.post("/start", authMiddleware, startActivity);
router.post("/point", addPoint);
router.post("/stop", authMiddleware, stopActivity);
router.get("/user/:userId", authMiddleware, getUserActivities);
router.get("/all", authMiddleware, adminMiddleware, getAllActivities);

// ✅ New delete route
router.delete("/:id", authMiddleware, adminMiddleware, deleteActivity);

export default router;
