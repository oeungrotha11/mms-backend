import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/adminRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js"
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payments", paymentRoutes);

app.use("/api/users", userRoutes);

app.use("/api/reviews", reviewRoutes);


// connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// start server
app.listen(5000, () => console.log("Server running on port 5000"));