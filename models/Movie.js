import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category_id: Number,
  category_name: String,
  description: String
});

const movieSchema = new mongoose.Schema({
  title: String,
  description: String,
  release_year: Number,
  duration: Number,
  language: String,

  category: {
    name: String,
    _id: mongoose.Schema.Types.ObjectId
  },

  poster_url: String,
  trailer_url: String,

  quality: {
    type: String,
    default: "HD"
  },

  status: {
    type: String,
    default: "Active"
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Movie", movieSchema);