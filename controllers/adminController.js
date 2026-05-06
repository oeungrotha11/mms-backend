import User from "../models/User.js";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";
import Payment from "../models/Payment.js";
import Category from "../models/Category.js";

export const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalMovies = await Movie.countDocuments();

        const totalReviews = await Review.countDocuments();

        const payments = await Payment.find();
        const revenue = payments.reduce((sum, p) => sum + p.amount, 0);

        const recentUsers = await User.find().sort({ created_at: -1 }).limit(3);
        const recentMovies = await Movie.find().sort({ created_at: -1 }).limit(3);
        const recentPayments = await Payment.find().sort({ created_at: -1 }).limit(3);
        const recentReviews = await Review.find().sort({ created_at: -1 }).limit(3);
        const recentCategories = await Category.find().sort({ created_at: -1 }).limit(3);

        const activities = [
            // 👤 USERS
            ...recentUsers.map(u => ({
                type: "user",
                message: `${u.username} joined`,
                time: u.created_at
            })),

            // 🎬 MOVIES
            ...recentMovies.map(m => ({
                type: "movie",
                message: `Movie added: ${m.title}`,
                time: m.created_at
            })),

            // 💰 PAYMENTS
            ...recentPayments.map(p => ({
                type: "payment",
                message: `Payment $${p.amount}`,
                time: p.created_at
            })),

            // ⭐ REVIEWS
            ...recentReviews.map(r => ({
                type: "review",
                message: `New review added`,
                time: r.created_at
            })),

            // 🏷 CATEGORIES
            ...recentCategories.map(c => ({
                type: "category",
                message: `Category created: ${c.name}`,
                time: c.created_at
            }))
        ]
            .sort((a, b) => new Date(b.time) - new Date(a.time)) // 🔥 sort newest first
            .slice(0, 10); // limit to 10

        const now = new Date();
        const monthLabels = Array.from({ length: 6 }, (_, idx) => {
            const date = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
            return {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                label: date.toLocaleString("default", { month: "short" })
            };
        });

        const revenueByMonth = await Payment.aggregate([
            {
                $match: {
                    created_at: {
                        $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$created_at" },
                        month: { $month: "$created_at" }
                    },
                    total: { $sum: "$amount" }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        const monthlyRevenue = monthLabels.map(({ year, month, label }) => {
            const found = revenueByMonth.find(
                (item) => item._id.year === year && item._id.month === month
            );
            return {
                month: label,
                revenue: found ? found.total : 0
            };
        });

        const categories = await Movie.aggregate([
            {
                $group: {
                    _id: {
                        $ifNull: ["$category", "$genre"]
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.json({
            totalUsers,
            totalMovies,
            totalReviews,
            revenue,
            recentMovies,
            monthlyRevenue,
            categoryStats: categories,
            activities
        });

    } catch (err) {
        res.status(500).json(err.message);
    }
};