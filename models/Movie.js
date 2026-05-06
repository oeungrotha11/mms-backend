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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },

  poster_url: String,
  trailer_url: String,

  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Movie", movieSchema);