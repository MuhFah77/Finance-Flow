import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not sign in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 text-sm text-ink/60 dark:text-dink/60 hover:underline"
      >
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </button>
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl mb-1">Finance Flow</h1>
        <p className="text-ink/60 dark:text-dink/60 text-sm mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="text-sm block">
            <span className="block text-ink/60 dark:text-dink/60 mb-1">Email</span>
            <input
              type="email"
              className="input-field"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </label>
          <label className="text-sm block">
            <span className="block text-ink/60 dark:text-dink/60 mb-1">Password</span>
            <input
              type="password"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
            />
          </label>
          {error && <p className="text-brick text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full">
            Sign in
          </button>
        </form>

        <p className="text-sm text-ink/60 dark:text-dink/60 mt-6">
          No account yet?{" "}
          <Link to="/register" className="text-pine hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
