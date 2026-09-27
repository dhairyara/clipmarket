import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "clipper" });
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const user = await signup(form);
      navigate(user.role === "creator" ? "/creator" : "/clipper");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-surface border border-line rounded-xl p-8"
      >
        <h1 className="font-display text-2xl font-semibold mb-1">Join ClipMarket</h1>
        <p className="text-muted text-sm mb-6">Create clips, earn money — or find clippers for your content</p>

        {error && (
          <div className="bg-coral/10 border border-coral/40 text-coral text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            type="button"
            onClick={() => update("role", "clipper")}
            className={`rounded-lg py-2.5 text-sm font-medium border transition ${
              form.role === "clipper"
                ? "bg-lime text-ink border-lime"
                : "border-line text-muted"
            }`}
          >
            I'm a Clipper
          </button>
          <button
            type="button"
            onClick={() => update("role", "creator")}
            className={`rounded-lg py-2.5 text-sm font-medium border transition ${
              form.role === "creator"
                ? "bg-lime text-ink border-lime"
                : "border-line text-muted"
            }`}
          >
            I'm a Creator
          </button>
        </div>

        <label className="block text-sm text-muted mb-1">Name</label>
        <input
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full bg-ink border border-line rounded-lg px-3 py-2 mb-4 outline-none focus:border-lime"
        />

        <label className="block text-sm text-muted mb-1">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="w-full bg-ink border border-line rounded-lg px-3 py-2 mb-4 outline-none focus:border-lime"
        />

        <label className="block text-sm text-muted mb-1">Password</label>
        <input
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          className="w-full bg-ink border border-line rounded-lg px-3 py-2 mb-6 outline-none focus:border-lime"
        />

        <button className="w-full bg-lime text-ink font-semibold rounded-lg py-2.5 hover:opacity-90 transition">
          Create account
        </button>

        <p className="text-sm text-muted mt-5 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-lime">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
