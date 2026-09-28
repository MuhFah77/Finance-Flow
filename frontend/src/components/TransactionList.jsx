const formatMoney = (n, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n || 0);

const TransactionList = ({ transactions, currency, onDelete }) => {
  if (!transactions.length) {
    return (
      <div className="card p-10 text-center text-ink/50 dark:text-dink/50 text-sm">
        No transactions yet. Add your first one to start the ledger.
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="ledger-rule text-left text-ink/50 dark:text-dink/50 text-xs uppercase tracking-wide">
            <th className="px-5 py-3 font-medium">Date</th>
            <th className="px-5 py-3 font-medium">Category</th>
            <th className="px-5 py-3 font-medium">Note</th>
            <th className="px-5 py-3 font-medium text-right">Amount</th>
            <th className="px-5 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id} className="ledger-rule last:border-b-0  hover:bg-sand/50 dark:hover:bg-dsand/50">
              <td className="px-5 py-3 text-ink/70 dark:text-dink/70">
                {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </td>
              <td className="px-5 py-3">
                <span className="inline-flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: t.category?.color || "#2F5D50" }}
                  />
                  {t.category?.name || "Uncategorized"}
                </span>
              </td>
              <td className="px-5 py-3 text-ink/60 dark:text-dink/60">{t.note || "—"}</td>
              <td
                className={`px-5 py-3 text-right tabular font-medium ${
                  t.type === "income" ? "text-pine" : "text-brick"
                }`}
              >
                {t.type === "income" ? "+" : "−"}
                {formatMoney(t.amount, currency)}
              </td>
              <td className="px-5 py-3 text-right">
                <button
                  onClick={() => onDelete(t._id)}
                  className="text-xs text-ink/40 dark:text-dink/40 hover:text-brick"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
