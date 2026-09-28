import { useState } from "react";

const CategoryManager = ({ categories, onCreate, onDelete }) => {
  const [form, setForm] = useState({ name: "", type: "expense" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onCreate(form);
    setForm({ name: "", type: "expense" });
  };

  return (
    <div className="card p-5">
      <h3 className="font-display text-lg mb-4">Categories</h3>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="New category"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="input-field flex-1"
        />
        <select
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          className="input-field w-32"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit" className="btn-secondary whitespace-nowrap">
          Add
        </button>
      </form>

      <ul className="space-y-1">
        {categories.map((c) => (
          <li key={c._id} className="flex items-center justify-between text-sm ledger-rule py-2 last:border-b-0">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
              {c.name}
              <span className="text-ink/40 text-xs">({c.type})</span>
            </span>
            <button onClick={() => onDelete(c._id)} className="text-xs text-ink/40 hover:text-brick">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;
