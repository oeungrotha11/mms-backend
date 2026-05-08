import express from "express";

import {
  getReviews,
  addReview,
  deleteReview,
  approveReview,
  getMovieReviews,
  updateReview
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", getReviews);

router.get("/movie/:movieId", getMovieReviews);

router.post("/", addReview);

router.delete("/:id", deleteReview);

router.put("/:id/approve", approveReview);

router.put("/:id", updateReview);

export default router;