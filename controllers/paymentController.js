import Payment from "../models/Payment.js";
import Plan from "../models/Plan.js";
import Subscription from "../models/Subscription.js";

// GET ALL PAYMENTS
export const getPayments = async (req, res) => {
  const payments = await Payment.find()
    .populate("user")
    .populate("plan")
    .sort({ created_at: -1 });

  res.json(payments);
};

// CREATE PAYMENT + SUBSCRIPTION
export const createPayment = async (req, res) => {
  try {
    const { userId, planId, method } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json("Plan not found");

    // 💰 create payment
    const payment = await Payment.create({
      user: userId,
      plan: planId,
      amount: plan.price,
      method,
      status: "completed"
    });

    // 🔥 create subscription
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + plan.duration_days);

    await Subscription.create({
      user: userId,
      plan: planId,
      start_date: start,
      end_date: end,
      status: "active"
    });

    res.json({ message: "Payment successful", payment });

  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
};