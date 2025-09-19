import express from "express";
import {
  createGroup,
  joinGroup,
  getGroups,
  getGroupById,
  getActiveGroupsByUser,
  createClub,
  getClubsByGroup,
  updateClub,
  deleteClub
} from "../controllers/groupController.js";

const router = express.Router();

router.post("/", createGroup);
router.post("/:groupId/join", joinGroup);
router.get("/", getGroups);
router.get("/:groupId", getGroupById);
router.get("/user/:userId/active", getActiveGroupsByUser);

router.post("/:groupId/clubs", createClub);       
router.get("/:groupId/clubs", getClubsByGroup);  
router.put("/:groupId/clubs/:id", updateClub);    
router.delete("/:groupId/clubs/:id", deleteClub);

export default router;
