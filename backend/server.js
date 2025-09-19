import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api", profileRoutes);
app.use("/api", routeRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/groups", groupRoutes);

// Root
app.get("/", (req, res) => {
  res.send("API is running.");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server Running on port ${PORT}`);
});
