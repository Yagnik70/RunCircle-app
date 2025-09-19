import express from "express";
import { 
  startActivity, 
  addPoint, 
  stopActivity, 
  getUserActivities 
} from "../controllers/activityController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start",authMiddleware, startActivity);
router.post("/point", addPoint);
router.post("/stop", authMiddleware, stopActivity);
router.get("/user/:userId", authMiddleware, getUserActivities);

export default router;
