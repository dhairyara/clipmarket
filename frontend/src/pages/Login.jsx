import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const user = await login(email, password);
      navigate(user.role === "creator" ? "/creator" : "/clipper");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-surface border border-line rounded-xl p-8"
      >
        <h1 className="font-display text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="text-muted text-sm mb-6">Log in to your ClipMarket account</p>

        {error && (
          <div className="bg-coral/10 border border-coral/40 text-coral text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <label className="block text-sm text-muted mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-ink border border-line rounded-lg px-3 py-2 mb-4 outline-none focus:border-lime"
          placeholder="you@example.com"
        />

        <label className="block text-sm text-muted mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-ink border border-line rounded-lg px-3 py-2 mb-6 outline-none focus:border-lime"
          placeholder="••••••••"
        />

        <button className="w-full bg-lime text-ink font-semibold rounded-lg py-2.5 hover:opacity-90 transition">
          Log in
        </button>

        <p className="text-sm text-muted mt-5 text-center">
          New here?{" "}
          <Link to="/signup" className="text-lime">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
