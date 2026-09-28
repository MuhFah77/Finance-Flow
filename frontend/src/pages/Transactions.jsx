import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import CategoryManager from "../components/CategoryManager";

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    const { data } = await api.get("/categories");
    setCategories(data);
  };

  const loadTransactions = async (type = filterType) => {
    const { data } = await api.get("/transactions", { params: { limit: 100, type: type || undefined } });
    setTransactions(data.transactions);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
    loadTransactions();
  }, []);

  const handleCreate = async (form) => {
    await api.post("/transactions", form);
    loadTransactions();
  };

  const handleDelete = async (id) => {
    await api.delete(`/transactions/${id}`);
    loadTransactions();
  };

  const handleCreateCategory = async (form) => {
    await api.post("/categories", form);
    loadCategories();
  };

  const handleDeleteCategory = async (id) => {
    await api.delete(`/categories/${id}`);
    loadCategories();
  };

  const handleFilter = (type) => {
    setFilterType(type);
    loadTransactions(type);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Transactions</h1>
        <div className="flex gap-1">
          {[
            { label: "All", value: "" },
            { label: "Income", value: "income" },
            { label: "Expenses", value: "expense" },
          ].map((f) => (
            <button
              key={f.label}
              onClick={() => handleFilter(f.value)}
              className={`text-sm px-3 py-1.5 rounded-sm ${
                filterType === f.value ? "bg-pine text-paper" : "border border-line hover:bg-sand"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading ? (
            <p className="text-ink/50 dark:text-dink/50 text-sm">Loading…</p>
          ) : (
            <TransactionList transactions={transactions} currency={user.currency} onDelete={handleDelete} />
          )}
        </div>
        <div className="space-y-6">
          <TransactionForm categories={categories} onSubmit={handleCreate} />
          <CategoryManager
            categories={categories}
            onCreate={handleCreateCategory}
            onDelete={handleDeleteCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
