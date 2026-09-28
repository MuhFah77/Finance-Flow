import { useState } from "react";

const formatMoney = (n, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n || 0);

const BudgetManager = ({ budgets, expenseCategories, currency, onCreate, onDelete }) => {
  const now = new Date();
  const [form, setForm] = useState({ category: "", monthlyLimit: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.category || !form.monthlyLimit) return;
    onCreate({
      category: form.category,
      monthlyLimit: Number(form.monthlyLimit),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });
    setForm({ category: "", monthlyLimit: "" });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="card p-5 flex flex-wrap gap-3 items-end">
        <label className="text-sm flex-1 min-w-[160px]">
          <span className="block text-ink/60 dark:text-dink/60 mb-1">Category</span>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="input-field"
          >
            <option value="" disabled>
              Select category
            </option>
            {expenseCategories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm w-40">
          <span className="block text-ink/60 dark:text-dink/60 mb-1">Monthly limit</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.monthlyLimit}
            onChange={(e) => setForm((f) => ({ ...f, monthlyLimit: e.target.value }))}
            className="input-field"
            placeholder="0.00"
          />
        </label>
        <button type="submit" className="btn-primary">
          Set budget
        </button>
      </form>

      <div className="space-y-3">
        {budgets.length === 0 && (
          <div className="card p-10 text-center text-ink/50 dark:text-dink/50 text-sm">
            No budgets set for this month yet.
          </div>
        )}
        {budgets.map((b) => {
          const pct = b.monthlyLimit > 0 ? Math.min(100, (b.spent / b.monthlyLimit) * 100) : 0;
          const over = b.spent > b.monthlyLimit;
          return (
            <div key={b._id} className="card p-5">
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.category?.color }} />
                  {b.category?.name}
                </span>
                <span className={`text-sm tabular ${over ? "text-brick" : "text-ink/60 dark:text-dink/60"}`}>
                  {formatMoney(b.spent, currency)} / {formatMoney(b.monthlyLimit, currency)}
                </span>
              </div>
              <div className="h-1.5 bg-sand dark:bg-dline rounded-full overflow-hidden">
                <div
                  className={`h-full ${over ? "bg-brick" : "bg-pine"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-end mt-2">
                <button onClick={() => onDelete(b._id)} className="text-xs text-ink/40 dark:text-dink/40 hover:text-brick">
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetManager;
