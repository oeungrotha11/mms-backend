import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  const {
    username,
    email,
    password,
    phone,
    date_of_birth
  } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json("User already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashed,
    phone,
    date_of_birth
  });

  res.json({ message: "Registered successfully", user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json("Wrong password");

  const token = generateToken(user);

  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile_picture: user.profile_picture,
      status: user.status
    }
  });
};