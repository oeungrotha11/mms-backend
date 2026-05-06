import express from "express";
import { getUsersWithSubs } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getUsersWithSubs);

export default router;