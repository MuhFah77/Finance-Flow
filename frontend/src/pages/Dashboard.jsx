import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import SummaryCards from "../components/SummaryCards";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

const formatMoney = (n, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n || 0);

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [summaryRes, categoriesRes, txRes] = await Promise.all([
      api.get("/transactions/summary", { params: { month, year } }),
      api.get("/categories"),
      api.get("/transactions?limit=5"),
    ]);
    setSummary(summaryRes.data);
    setCategories(categoriesRes.data);
    setRecent(txRes.data.transactions);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreate = async (form) => {
    await api.post("/transactions", form);
    loadAll();
  };

  const handleDelete = async (id) => {
    await api.delete(`/transactions/${id}`);
    loadAll();
  };

  if (loading) return <div className="max-w-5xl mx-auto px-6 py-10 text-ink/50 dark:text-dink/50">Loading…</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="font-display text-2xl mb-1">
          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h1>
        <p className="text-ink/50 dark:text-dink/50 text-sm">Here's where things stand this month.</p>
      </div>

      <SummaryCards summary={summary} currency={user.currency} />

      {summary.byCategory?.length > 0 && (
        <div className="card p-5">
          <h3 className="font-display text-lg mb-4">Spending by category</h3>
          <div className="space-y-3">
            {summary.byCategory.map((c) => {
              const pct = summary.expense > 0 ? (c.total / summary.expense) * 100 : 0;
              return (
                <div key={c.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{c.category}</span>
                    <span className="tabular text-ink/60 dark:text-dink/60">{formatMoney(c.total, user.currency)}</span>
                  </div>
                  <div className="h-1.5 bg-sand dark:bg-dline rounded-full overflow-hidden">
                    <div className="h-full bg-brick" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-display text-lg">Recent transactions</h3>
          <TransactionList transactions={recent} currency={user.currency} onDelete={handleDelete} />
        </div>
        <div>
          <h3 className="font-display text-lg mb-3">Add transaction</h3>
          <TransactionForm categories={categories} onSubmit={handleCreate} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
