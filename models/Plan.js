import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  duration_days: {
    type: Number,
    required: true // 30, 90, etc.
  },

  quality: {
    type: String // HD, Full HD, 4K
  },

  devices: {
    type: Number // number of devices allowed
  },

  description: {
    type: String
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Plan", planSchema);