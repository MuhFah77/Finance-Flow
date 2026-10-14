const crypto = require("crypto");
const User = require("../models/User");
const Category = require("../models/Category");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

const DEMO_EMAIL = "demo@ledger.app";
const MONTHS = 6;

const CATEGORIES = [
  { name: "Salary", type: "income", color: "#2F5D50" },
  { name: "Freelance", type: "income", color: "#3F6C8C" },
  { name: "Investments", type: "income", color: "#6E8F4E" },
  { name: "Rent", type: "expense", color: "#8B3A3A" },
  { name: "Groceries", type: "expense", color: "#B7862E" },
  { name: "Utilities", type: "expense", color: "#7A5A86" },
  { name: "Transport", type: "expense", color: "#3F7767" },
  { name: "Dining out", type: "expense", color: "#B5651D" },
  { name: "Entertainment", type: "expense", color: "#5C6670" },
];

const buildTransactions = (userId, catId) => {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const today = now.getUTCDate();
  const tx = [];

  for (let i = MONTHS - 1; i >= 0; i--) {
    const base = new Date(Date.UTC(y, m - i, 1));
    const yy = base.getUTCFullYear();
    const mm = base.getUTCMonth();
    const isCurrent = i === 0;

    // small deterministic variation so months don't look identical
    const wobble = (n) => 1 + (((i * 7 + n * 3) % 10) - 5) / 50;

    const add = (type, cat, amount, day, note = "") => {
      const d = isCurrent ? Math.min(day, today) : day; // never future-dated
      tx.push({
        user: userId,
        type,
        category: catId[cat],
        amount: Math.round(amount),
        note,
        date: new Date(Date.UTC(yy, mm, d)),
      });
    };

    add("income", "Salary", 4200, 1, "Monthly salary");
    add("income", "Freelance", 600 * wobble(1), 12, "Website project");
    if (i % 2 === 0) add("income", "Investments", 150 * wobble(2), 20, "Dividends");

    add("expense", "Rent", 1200, 3, "Monthly rent");
    add("expense", "Utilities", 140 * wobble(3), 8, "Electricity and internet");

    [5, 12, 19, 26].forEach((day, k) =>
      add("expense", "Groceries", 100 * wobble(4 + k), day, "Weekly groceries")
    );
    [7, 21].forEach((day, k) =>
      add("expense", "Transport", 45 * wobble(8 + k), day, "Fuel / rides")
    );
    [10, 17, 24].forEach((day, k) =>
      add("expense", "Dining out", 45 * wobble(10 + k), day)
    );
    [15, 28].forEach((day, k) =>
      add("expense", "Entertainment", 45 * wobble(13 + k), day)
    );
  }
  return tx;
};

const resetDemo = async () => {
  let user = await User.findOne({ email: DEMO_EMAIL });
  if (!user) {
    user = await User.create({
      name: "Demo User",
      email: DEMO_EMAIL,
      password: crypto.randomBytes(16).toString("hex"), // nobody needs to know it
    });
  }

  await Promise.all([
    Transaction.deleteMany({ user: user._id }),
    Budget.deleteMany({ user: user._id }),
    Category.deleteMany({ user: user._id }),
  ]);

  const cats = await Category.insertMany(CATEGORIES.map((c) => ({ ...c, user: user._id })));
  const catId = {};
  cats.forEach((c) => {
    catId[c.name] = c._id;
  });

  await Transaction.insertMany(buildTransactions(user._id, catId));

  const now = new Date();
  const month = now.getUTCMonth() + 1;
  const year = now.getUTCFullYear();
  const limits = { Groceries: 450, "Dining out": 200, Transport: 80, Entertainment: 100, Utilities: 180 };

  await Budget.insertMany(
    Object.entries(limits).map(([name, monthlyLimit]) => ({
      user: user._id,
      category: catId[name],
      monthlyLimit,
      month,
      year,
    }))
  );

  return user;
};

module.exports = { resetDemo };