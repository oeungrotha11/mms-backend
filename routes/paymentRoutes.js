import express from "express";
import {
  getPayments,
  createPayment
} from "../controllers/paymentController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getPayments);
router.post("/", verifyToken, createPayment);

export default router;