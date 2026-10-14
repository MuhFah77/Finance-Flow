const express = require("express");
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
  getTrend,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();



router.use(protect);
router.get("/summary", getSummary);
router.get("/trend", getTrend);    
router.route("/").get(getTransactions).post(createTransaction);
router.route("/:id").put(updateTransaction).delete(deleteTransaction);

module.exports = router;
