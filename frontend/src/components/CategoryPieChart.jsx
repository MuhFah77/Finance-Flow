import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useTheme } from "../context/ThemeContext";

const formatMoney = (n, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n || 0);

const PALETTE = [
  "#8B3A3A", // brick
  "#2F5D50", // pine
  "#B7862E", // ochre
  "#3F6C8C", // slate blue
  "#7A5A86", // plum
  "#6E8F4E", // sage
  "#B5651D", // copper
  "#5C6670", // grey
];

const CategoryPieChart = ({ byCategory, currency }) => {
  const { theme } = useTheme();

  if (!byCategory?.length) return null;

  return (
    <div className="card p-5">
      <h3 className="font-display text-lg mb-4">Spending by category</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={byCategory}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
          >
            {byCategory.map((entry, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatMoney(value, currency)}
            contentStyle={{
              backgroundColor: theme === "dark" ? "#1C2126" : "#FFFFFF",
              border: `1px solid ${theme === "dark" ? "#2C333A" : "#DAD5C8"}`,
              borderRadius: 2,
              fontSize: 13,
            }}
          />
          <Legend
            formatter={(value) => <span style={{ color: theme === "dark" ? "#EDEBE3" : "#1B2430" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;