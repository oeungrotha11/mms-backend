import Plan from "../models/Plan.js";
import Subscription from "../models/Subscription.js";


// ================= PLAN =================

// GET ALL PLANS
export const getPlans = async (req, res) => {
  const plans = await Plan.find();
  res.json(plans);
};

// ADD PLAN (ADMIN)
export const addPlan = async (req, res) => {
  try {
    const { name, price, duration_days, devices } = req.body;

    // 🔒 VALIDATION
    if (!name || !price || !duration_days || !devices) {
      return res.status(400).json("Missing required fields");
    }

    if (isNaN(price) || isNaN(duration_days) || isNaN(devices)) {
      return res.status(400).json("Price, Duration, and Devices must be numbers");
    }

    const plan = await Plan.create({
      ...req.body,
      price: Number(price),
      duration_days: Number(duration_days),
      devices: Number(devices)
    });

    res.json(plan);
  } catch (err) {
    console.error("ADD PLAN ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// DELETE PLAN
export const deletePlan = async (req, res) => {
  await Plan.findByIdAndDelete(req.params.id);
  res.json({ message: "Plan deleted" });
};


// ================= SUBSCRIPTION =================

// GET ALL SUBSCRIPTIONS
export const getSubscriptions = async (req, res) => {
  const subs = await Subscription.find()
    .populate("user")
    .populate("plan")
    .sort({ created_at: -1 });
    
  const now = new Date();

  subs.forEach(sub => {
    if (sub.end_date < now && sub.status === "active") {
      sub.status = "expired";
    }
  });

  res.json(subs);
};


// CREATE SUBSCRIPTION (when user pays)
export const createSubscription = async (req, res) => {
  const { userId, planId } = req.body;

  const plan = await Plan.findById(planId);
  if (!plan) return res.status(404).json("Plan not found");

  const start = new Date();
  const end = new Date();
  end.setDate(start.getDate() + plan.duration_days);

  const sub = await Subscription.create({
    user: userId,
    plan: planId,
    start_date: start,
    end_date: end
  });

  res.json(sub);
};

// CANCEL SUBSCRIPTION
export const cancelSubscription = async (req, res) => {
  await Subscription.findByIdAndUpdate(req.params.id, {
    status: "cancelled"
  });

  res.json({ message: "Cancelled" });
};