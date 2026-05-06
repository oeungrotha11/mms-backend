// models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Category", categorySchema);