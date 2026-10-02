import { useState } from "react";

const emptyForm = { category: "", type: "expense", amount: "", note: "", date: "" };

const todayLocal = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const TransactionForm = ({ categories, onSubmit, initial }) => {
  const [form, setForm] = useState(
    initial || { ...emptyForm, date: todayLocal() }
  );

  const filteredCategories = categories.filter((c) => c.type === form.type);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value, ...(name === "type" ? { category: "" } : {}) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.category || !form.amount) return;
    onSubmit({ ...form, amount: Number(form.amount) });
    if (!initial) setForm({ ...emptyForm, date: todayLocal() });
  };

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="block text-ink/60 dark:text-dink/60 mb-1">Type</span>
          <select name="type" value={form.type} onChange={handleChange} className="input-field">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="block text-ink/60 dark:text-dink/60 mb-1">Amount</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="input-field"
            placeholder="0.00"
            required
          />
        </label>
      </div>

      <label className="text-sm block">
        <span className="block text-ink/60 dark:text-dink/60 mb-1">Category</span>
        <select name="category" value={form.category} onChange={handleChange} className="input-field" required>
          <option value="" disabled>
            Select a category
          </option>
          {filteredCategories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm block">
        <span className="block text-ink/60 dark:text-dink/60 mb-1">Date</span>
        <input type="date" name="date" value={form.date} onChange={handleChange} className="input-field" />
      </label>

      <label className="text-sm block">
        <span className="block text-ink/60 dark:text-dink/60 mb-1">Note (optional)</span>
        <input
          type="text"
          name="note"
          value={form.note}
          onChange={handleChange}
          className="input-field"
          placeholder="What was this for?"
        />
      </label>

      <button type="submit" className="btn-primary w-full">
        {initial ? "Save changes" : "Add transaction"}
      </button>
    </form>
  );
};

export default TransactionForm;
