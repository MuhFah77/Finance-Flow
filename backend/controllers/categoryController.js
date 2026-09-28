const Category = require("../models/Category");

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ user: req.user._id }).sort({ type: 1, name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, type, color } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }
    const category = await Category.create({ user: req.user._id, name, type, color });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, user: req.user._id });
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.name = req.body.name ?? category.name;
    category.type = req.body.type ?? category.type;
    category.color = req.body.color ?? category.color;
    await category.save();

    res.json(category);
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
