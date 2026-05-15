import express from "express";
import { getUsersWithSubs, updateUser, deleteUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getUsersWithSubs);
router.put("/:id", verifyToken, isAdmin, updateUser);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

export default router;