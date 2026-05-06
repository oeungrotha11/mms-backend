import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  phone: {
    type: String,
    default: null
  },

  profile_picture: {
    type: String,
    default: "https://img.freepik.com/premium-vector/user-profile-icon-circle_1256048-12499.jpg?semt=ais_hybrid&w=740&q=80"
  },

  date_of_birth: {
    type: Date,
    default: null
  },

  status: {
    type: String,
    enum: ["active", "inactive", "banned"],
    default: "active"
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("User", userSchema);