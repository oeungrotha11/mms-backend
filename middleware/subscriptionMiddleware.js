import Subscription from "../models/Subscription.js";

export const requireSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id; // from token

    const sub = await Subscription.findOne({ user: userId })
      .sort({ created_at: -1 });

    if (!sub) {
      return res.status(403).json("No subscription");
    }

    const now = new Date();

    if (sub.end_date < now) {
      return res.status(403).json("Subscription expired");
    }

    if (sub.status !== "active") {
      return res.status(403).json("Subscription inactive");
    }

    // ✅ user is allowed
    req.subscription = sub;
    next();

  } catch (err) {
    res.status(500).json(err.message);
  }
};