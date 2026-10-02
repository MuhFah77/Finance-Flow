const Transaction = require("../models/Transaction");

const getTransactions = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 20 } = req.query;

    const filter = { user: req.user._id };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate("category", "name type color")
        .sort({ date: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Transaction.countDocuments(filter),
    ]);

    res.json({ transactions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const { category, type, amount, note, date } = req.body;
    if (!category || !type || !amount) {
      return res.status(400).json({ message: "Category, type and amount are required" });
    }
    const transaction = await Transaction.create({
      user: req.user._id,
      category,
      type,
      amount,
      note,
      date: date || Date.now(),
    });
    const populated = await transaction.populate("category", "name type color");
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    const { category, type, amount, note, date } = req.body;
    transaction.category = category ?? transaction.category;
    transaction.type = type ?? transaction.type;
    transaction.amount = amount ?? transaction.amount;
    transaction.note = note ?? transaction.note;
    transaction.date = date ?? transaction.date;
    await transaction.save();

    const populated = await transaction.populate("category", "name type color");
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    next(err);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const m = Number(month) || now.getMonth() + 1;
    const y = Number(year) || now.getFullYear();

    const start = new Date(Date.UTC(y, m - 1, 1));
    const end = new Date(Date.UTC(y, m, 1));

    console.log("SUMMARY DEBUG:", {
      reqUserId: req.user._id.toString(),
      start,
      end,
    });

    const results = await Transaction.aggregate([
      { $match: { user: req.user._id, date: { $gte: start, $lt: end } } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]);

    console.log("SUMMARY RESULTS:", results);

    const summary = { income: 0, expense: 0 };
    results.forEach((r) => {
      summary[r._id] = r.total;
    });
    summary.balance = summary.income - summary.expense;

    const byCategory = await Transaction.aggregate([
      { $match: { user: req.user._id, type: "expense", date: { $gte: start, $lt: end } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
      { $unwind: "$category" },
      { $project: { _id: 0, category: "$category.name", color: "$category.color", total: 1 } },
      { $sort: { total: -1 } },
    ]);

    res.json({ ...summary, byCategory, month: m, year: y });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
};
