import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useTheme } from "../context/ThemeContext";


const formatMoney = (n, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n || 0);

const TrendChart = ({ data, currency }) => {
  const { theme } = useTheme();
  console.log("TrendChart data:", data);
  const gridColor = theme === "dark" ? "#2C333A" : "#DAD5C8";
  const textColor = theme === "dark" ? "#EDEBE3" : "#1B2430";

  return (
    <div className="card p-5">
      <h3 className="font-display text-lg mb-4">Income vs. expenses</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="label" stroke={textColor} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            stroke={textColor}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatMoney(v, currency)}
            width={70}
          />
          <Tooltip
            formatter={(value) => formatMoney(value, currency)}
            contentStyle={{
              backgroundColor: theme === "dark" ? "#1C2126" : "#FFFFFF",
              border: `1px solid ${gridColor}`,
              borderRadius: 2,
              fontSize: 13,
            }}
          />
          <Bar dataKey="income" fill="#2F5D50" radius={[2, 2, 0, 0]} />
          <Bar dataKey="expense" fill="#8B3A3A" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;