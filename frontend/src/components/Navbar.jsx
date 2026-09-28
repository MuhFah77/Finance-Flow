import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";


const linkClass = ({ isActive }) =>
  `text-sm px-3 py-2 rounded-sm transition-colors ${
    isActive
      ? "bg-pine text-paper"
      : "text-ink dark:text-dink hover:bg-sand dark:hover:bg-dsand"
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();


  if (!user) return null;

  return (
    <header className="border-b border-line dark:border-dline bg-paper dark:bg-dpaper sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-baseline gap-8">
          <span className="font-display text-xl tracking-tight">Finance Flow</span>
          <nav className="flex gap-1">
            <NavLink to="/" className={linkClass} end>
              Dashboard
            </NavLink>
            <NavLink to="/transactions" className={linkClass}>
              Transactions
            </NavLink>
            <NavLink to="/budgets" className={linkClass}>
              Budgets
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-ink/60 dark:text-dink/60">{user.name}</span>
          <button onClick={toggleTheme} className="text-sm text-ink/60 dark:text-dink/60 hover:underline">
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-sm text-brick hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
