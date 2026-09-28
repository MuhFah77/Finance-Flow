const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

const getBudgets = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const m = Number(month) || now.getMonth() + 1;
    const y = Number(year) || now.getFullYear();

    const budgets = await Budget.find({ user: req.user._id, month: m, year: y }).populate(
      "category",
      "name color"
    );

    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 1);

    const spentAgg = await Transaction.aggregate([
      { $match: { user: req.user._id, type: "expense", date: { $gte: start, $lt: end } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);
    const spentMap = {};
    spentAgg.forEach((s) => {
      spentMap[s._id.toString()] = s.total;
    });

    const result = budgets.map((b) => ({
      _id: b._id,
      category: b.category,
      monthlyLimit: b.monthlyLimit,
      month: b.month,
      year: b.year,
      spent: spentMap[b.category._id.toString()] || 0,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

const createBudget = async (req, res, next) => {
  try {
    const { category, monthlyLimit, month, year } = req.body;
    if (!category || monthlyLimit === undefined || !month || !year) {
      return res.status(400).json({ message: "Category, monthlyLimit, month and year are required" });
    }
    const budget = await Budget.create({ user: req.user._id, category, monthlyLimit, month, year });
    const populated = await budget.populate("category", "name color");
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

const updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });
    if (!budget) return res.status(404).json({ message: "Budget not found" });

    budget.monthlyLimit = req.body.monthlyLimit ?? budget.monthlyLimit;
    await budget.save();

    const populated = await budget.populate("category", "name color");
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json({ message: "Budget deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getBudgets, createBudget, updateBudget, deleteBudget };
