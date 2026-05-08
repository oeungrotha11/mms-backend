import Movie from "../models/Movie.js";
import Category from "../models/Category.js";

// GET ALL MOVIES
export const getMovies = async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
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



