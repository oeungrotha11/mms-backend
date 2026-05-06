import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
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

  amount: {
    type: Number,
    required: true
  },

  method: {
    type: String // card, paypal
  },

  status: {
    type: String,
    enum: ["completed", "failed"],
    default: "completed"
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Payment", paymentSchema);