import Movie from "../models/Movie.js";
import Category from "../models/Category.js";
import Review from "../models/Review.js";
import mongoose from "mongoose";

// GET ALL MOVIES
export const getMovies = async (req, res) => {
  try {

    const { search, category, quality, limit: queryLimit } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(queryLimit) || 20;
    const skip = (page - 1) * limit;

    let filter = {};

    // SEARCH
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // CATEGORY (IMPORTANT FIX)
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.$or = [
          { "category._id": new mongoose.Types.ObjectId(category) },
          { category }
        ];
      } else {
        filter.category = category;
      }
    }

    if (quality) {
      filter.quality = quality;
    }

    // COUNT (BEFORE PAGINATION)
    const total = await Movie.countDocuments(filter);

    // DATA
    const movies = await Movie.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const movieIds = movies.map(m => m._id);

    const ratings = await Review.aggregate([
      {
        $match: {
          movie: { $in: movieIds }
        }
      },
      {
        $group: {
          _id: "$movie",
          avgRating: {
            $avg: "$rating"
          }
        }
      }
    ]);

    const ratingMap = {};

    ratings.forEach(r => {
      ratingMap[r._id.toString()] = r.avgRating;
    });

    const result = movies.map(movie => ({
      ...movie.toObject(),
      avgRating:
        ratingMap[movie._id.toString()] || 0
    }));

    const totalPages = Math.ceil(total / limit);


    res.json({
      movies: result,
      total,
      totalPages,
      page
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE CATEGORY
export const updateCategory = async (req, res) => {
  try {

    const updatedCategory =
      await Category.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name
        },
        {
          new: true
        }
      );

    if (!updatedCategory) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    res.json(updatedCategory);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMovieById = async (req, res) => {
  try {

    const movie = await Movie.findById(req.params.id)
      .populate("category");

    if (!movie) {
      return res.status(404).json("Movie not found");
    }

    res.json(movie);

  } catch (err) {
    res.status(500).json(err.message);
  }
};

// ADD MOVIE
export const addMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const saved = await movie.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE MOVIE
export const updateMovie = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (typeof updateData.category === "string" && mongoose.Types.ObjectId.isValid(updateData.category)) {
      const category = await Category.findById(updateData.category);
      if (category) {
        updateData.category = {
          _id: category._id,
          name: category.name
        };
      }
    }

    const updated = await Movie.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// DELETE MOVIE
export const deleteMovie = async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

//GET CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const data = await Category.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//ADD CATEGORIES
export const addCategory = async (req, res) => {
  try {
    const newCat = new Category(req.body);
    const saved = await newCat.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET CATEGORIES WITH COUNT
export const getCategoriesWithCount = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "movies",
          let: { categoryName: "$name" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$category.name", "$$categoryName"]
                }
              }
            }
          ],
          as: "movies"
        }
      },
      {
        $addFields: {
          movieCount: { $size: "$movies" }
        }
      },
      {
        $project: {
          movies: 0 // remove full movies array (optional)
        }
      }
    ]);

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



