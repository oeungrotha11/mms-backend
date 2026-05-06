import User from "../models/User.js";
import Subscription from "../models/Subscription.js";
import Plan from "../models/Plan.js";

export const getUsersWithSubs = async (req, res) => {
  try {
    const users = await User.find();

    const result = await Promise.all(
      users.map(async (u) => {
        const sub = await Subscription.findOne({ user: u._id })
          .populate("plan")
          .sort({ created_at: -1 });

        return {
          ...u._doc,
          subscription: sub || null
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
};