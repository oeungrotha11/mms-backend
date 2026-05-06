import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  movie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie"
  },
  rating: {
    type: Number,
    required: true
  },
  comment: String,
  review_date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Review", reviewSchema);