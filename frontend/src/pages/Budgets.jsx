import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import BudgetManager from "../components/BudgetManager";

const Budgets = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [budgetsRes, categoriesRes] = await Promise.all([
      api.get("/budgets", { params: { month, year } }),
      api.get("/categories"),
    ]);
    setBudgets(budgetsRes.data);
    setCategories(categoriesRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreate = async (form) => {
    await api.post("/budgets", form);
    loadAll();
  };

  const handleDelete = async (id) => {
    await api.delete(`/budgets/${id}`);
    loadAll();
  };

  const expenseCategories = categories.filter((c) => c.type === "expense");

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <div>
        <h1 className="font-display text-2xl mb-1">Budgets</h1>
        <p className="text-ink/50 dark:text-dink/50 text-sm">
          Set monthly limits for {new Date().toLocaleDateString("en-US", { month: "long" })}.
        </p>
      </div>

      {loading ? (
        <p className="text-ink/50 dark:text-dink/50 text-sm">Loading…</p>
      ) : (
        <BudgetManager
          budgets={budgets}
          expenseCategories={expenseCategories}
          currency={user.currency}
          onCreate={handleCreate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Budgets;
