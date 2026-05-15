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

export const updateUser = async (req, res) => {
  try {
    const updateData = {};
    const fields = [
      'username',
      'email',
      'role',
      'status',
      'phone',
      'profile_picture'
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (req.body.date_of_birth !== undefined) {
      updateData.date_of_birth = req.body.date_of_birth ? new Date(req.body.date_of_birth) : null;
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};