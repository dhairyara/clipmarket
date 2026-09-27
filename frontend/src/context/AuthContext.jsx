import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("cm_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("cm_user", JSON.stringify(user));
    else localStorage.removeItem("cm_user");
  }, [user]);

  async function login(email, password) {
    const { data } = await client.post("/auth/login", { email, password });
    localStorage.setItem("cm_token", data.token);
    setUser(data.user);
    return data.user;
  }

  async function signup(payload) {
    const { data } = await client.post("/auth/signup", payload);
    localStorage.setItem("cm_token", data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("cm_token");
    setUser(null);
  }

  function updateWallet(walletBalance) {
    setUser((u) => (u ? { ...u, walletBalance } : u));
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateWallet }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
