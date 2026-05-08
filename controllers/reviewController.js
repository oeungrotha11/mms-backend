import Review from "../models/Review.js";


// GET ALL REVIEWS
export const getReviews = async (req, res) => {

    try {

        const reviews = await Review.find()

            .populate("user_id")
            .populate("movie_id")

            .sort({ review_date: -1 });

        res.json(reviews);

    } catch (err) {

        res.status(500).json(err.message);

    }
};


// ADD REVIEW
export const addReview = async (req, res) => {

    try {

        const review = await Review.create(req.body);

        res.json(review);

    } catch (err) {

        res.status(500).json(err.message);

    }
};


// DELETE REVIEW
export const deleteReview = async (req, res) => {

    try {

        await Review.findByIdAndDelete(req.params.id);

        res.json("Deleted");

    } catch (err) {

        res.status(500).json(err.message);

    }
};


// APPROVE REVIEW
export const approveReview = async (req, res) => {

    try {

        await Review.findByIdAndUpdate(
            req.params.id,
            {
                status: "approved"
            }
        );

        res.json("Approved");

    } catch (err) {

        res.status(500).json(err.message);

    }
};

export const getMovieReviews = async (req, res) => {

    try {

        const reviews = await Review.find({
            movie_id: req.params.movieId
        })

            .populate("user_id")

            .sort({ review_date: -1 });

        res.json(reviews);

    } catch (err) {

        res.status(500).json(err.message);

    }
};

export const updateReview = async (req, res) => {

    try {

        const updated = await Review.findByIdAndUpdate(
            req.params.id,
            {
                rating: req.body.rating,
                comment: req.body.comment
            },
            { new: true }
        );

        res.json(updated);

    } catch (err) {

        res.status(500).json(err.message);

    }
};