import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreatorDashboard from "./pages/CreatorDashboard";
import ClipperDashboard from "./pages/ClipperDashboard";
import Wallet from "./pages/Wallet";

function Protected({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === "creator" ? "/creator" : "/clipper"} replace />;
  }
  return children;
}

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b border-line px-4 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-display font-semibold text-lg">
          Clip<span className="text-lime">Market</span>
        </Link>
        <div className="flex items-center gap-5 text-sm">
          {user ? (
            <>
              <Link
                to={user.role === "creator" ? "/creator" : "/clipper"}
                className="text-muted hover:text-offwhite"
              >
                Dashboard
              </Link>
              <Link to="/wallet" className="text-muted hover:text-offwhite">
                Wallet
              </Link>
              <span className="text-muted hidden sm:inline">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="border border-line rounded-lg px-3 py-1.5 hover:border-coral hover:text-coral"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-muted hover:text-offwhite">
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-lime text-ink font-medium rounded-lg px-4 py-1.5"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-offwhite font-body">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/creator"
          element={
            <Protected role="creator">
              <CreatorDashboard />
            </Protected>
          }
        />
        <Route
          path="/clipper"
          element={
            <Protected role="clipper">
              <ClipperDashboard />
            </Protected>
          }
        />
        <Route
          path="/wallet"
          element={
            <Protected>
              <Wallet />
            </Protected>
          }
        />
      </Routes>
    </div>
  );
}
