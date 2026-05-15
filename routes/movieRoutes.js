import express from "express";
import {
  getMovies,
  addMovie,
  deleteMovie,
  getCategories,
  addCategory,
  getCategoriesWithCount,
  getMovieById,
  updateMovie,
  updateCategory
} from "../controllers/movieController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { requireSubscription } from "../middleware/subscriptionMiddleware.js";

const router = express.Router();

// categories route
router.get("/categories", getCategories);
router.post("/categories", addCategory);
router.put("/categories/:id",updateCategory);
router.get("/categories/with-count", getCategoriesWithCount);

//movies route
// router.get("/", verifyToken, getMovies);
router.get("/", verifyToken, requireSubscription, getMovies);
router.get("/:id", getMovieById);
router.put("/:id", verifyToken, isAdmin, updateMovie);

// ADMIN ONLY
router.post("/", verifyToken, isAdmin, addMovie);
router.delete("/:id", verifyToken, isAdmin, deleteMovie);

export default router;