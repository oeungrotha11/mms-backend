import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true
  },

  start_date: {
    type: Date,
    default: Date.now
  },

  end_date: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ["active", "expired", "cancelled"],
    default: "active"
  },

  auto_renew: {
    type: Boolean,
    default: false
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Subscription", subscriptionSchema);