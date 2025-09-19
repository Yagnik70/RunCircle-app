import express from "express";
import {
  createRoute,
  getUserRoutes,
  getSports,
  saveRoute,
  getSavedRoutes,
} from "../controllers/routeController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/routes", authMiddleware, createRoute);
router.get("/routes", authMiddleware, getUserRoutes);

router.get("/sports", getSports);

router.post("/saved-routes", authMiddleware, saveRoute);
router.get("/saved-routes", authMiddleware, getSavedRoutes);

export default router;
