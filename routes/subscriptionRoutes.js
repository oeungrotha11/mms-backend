import express from "express";
import {
  getPlans,
  addPlan,
  deletePlan,
  getSubscriptions,
  createSubscription,
  cancelSubscription
} from "../controllers/subscriptionController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// PLANS
router.get("/plans", getPlans);
router.post("/plans", verifyToken, isAdmin, addPlan);
router.delete("/plans/:id", verifyToken, isAdmin, deletePlan);

// SUBSCRIPTIONS
router.get("/", verifyToken, isAdmin, getSubscriptions);
router.post("/", verifyToken, createSubscription);
router.put("/:id/cancel", verifyToken, cancelSubscription);

export default router;