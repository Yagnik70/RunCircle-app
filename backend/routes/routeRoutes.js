import express from "express";
import {
  createRoute,
  getUserRoutes,
  getSports,
  saveRoute,
  getSavedRoutes,
  getAllRoutes,
  getAllSavedRoutes,
} from "../controllers/routeController.js";

// yaha pe dhyan do 👇
// authMiddleware => default export
import authMiddleware from "../middleware/authMiddleware.js";

// adminMiddleware => named export
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ------------------ USER ROUTES ------------------ */
router.post("/routes", authMiddleware, createRoute);
router.get("/routes", authMiddleware, getUserRoutes);
router.get("/sports", getSports);
router.post("/saved-routes", authMiddleware, saveRoute);
router.get("/saved-routes", authMiddleware, getSavedRoutes);

router.get("/admin/routes", adminMiddleware, getAllRoutes);
router.get("/admin/saved-routes", adminMiddleware, getAllSavedRoutes);

export default router;

