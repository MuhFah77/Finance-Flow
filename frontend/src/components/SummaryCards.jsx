const formatMoney = (n, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n || 0);

const SummaryCards = ({ summary, currency }) => {
  if (!summary) return null;

  const items = [
    { label: "Income", value: summary.income, tone: "text-pine" },
    { label: "Expenses", value: summary.expense, tone: "text-brick" },
    {
      label: "Balance",
      value: summary.balance,
      tone: summary.balance >= 0 ? "text-pine" : "text-brick",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-line dark:bg-dline border border-line dark:border-dline rounded-sm overflow-hidden">  
      {items.map((item) => (
        <div key={item.label} className="bg-white dark:bg-dsand p-6">
          <p className="text-xs uppercase tracking-wide text-ink/50 dark:text-dink/50 mb-2">{item.label}</p>
          <p className={`font-display text-3xl tabular ${item.tone}`}>
            {formatMoney(item.value, currency)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
