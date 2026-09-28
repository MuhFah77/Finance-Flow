
const User = require("../models/User");
const Category = require("../models/Category");
const generateToken = require("../utils/generateToken");

// @desc Register a new user
// @route POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password });

    const defaultCategories = [
      { name: "Salary", type: "income", color: "#2F5D50" },
      { name: "Freelance", type: "income", color: "#3F7767" },
      { name: "Investments", type: "income", color: "#1F4038" },
      { name: "Groceries", type: "expense", color: "#8B3A3A" },
      { name: "Rent", type: "expense", color: "#A9504E" },
      { name: "Utilities", type: "expense", color: "#8B3A3A" },
      { name: "Transport", type: "expense", color: "#A9504E" },
    ];

    await Category.insertMany(
      defaultCategories.map((c) => ({ ...c, user: user._id }))
    );

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @desc Login user
// @route POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get current user profile
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser, getMe };
