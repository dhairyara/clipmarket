import { useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Wallet() {
  const { user, updateWallet } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  async function loadTransactions() {
    const { data } = await client.get("/wallet/transactions");
    setTransactions(data);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  async function deposit() {
    setError("");
    try {
      const { data } = await client.post("/wallet/deposit", { amount: Number(amount) });
      updateWallet(data.walletBalance);
      setAmount("");
      loadTransactions();
    } catch (err) {
      setError(err.response?.data?.message || "Deposit failed");
    }
  }

  async function payout() {
    setError("");
    try {
      const { data } = await client.post("/wallet/payout", { amount: Number(amount) });
      updateWallet(data.walletBalance);
      setAmount("");
      loadTransactions();
    } catch (err) {
      setError(err.response?.data?.message || "Payout failed");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-semibold mb-1">Wallet</h1>
      <p className="text-muted text-sm mb-8">
        Balance: <span className="text-lime font-medium text-lg">₹{user?.walletBalance ?? 0}</span>
      </p>

      <div className="bg-surface border border-line rounded-xl p-6 mb-8">
        {error && (
          <div className="bg-coral/10 border border-coral/40 text-coral text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}
        <label className="block text-sm text-muted mb-1">Amount (₹)</label>
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-ink border border-line rounded-lg px-3 py-2 mb-4 outline-none focus:border-lime"
        />
        <div className="flex gap-3">
          {user?.role === "creator" && (
            <button
              onClick={deposit}
              className="flex-1 bg-lime text-ink font-semibold rounded-lg py-2.5"
            >
              Add funds
            </button>
          )}
          {user?.role === "clipper" && (
            <button
              onClick={payout}
              className="flex-1 bg-lime text-ink font-semibold rounded-lg py-2.5"
            >
              Withdraw to bank/UPI
            </button>
          )}
        </div>
        <p className="text-xs text-muted mt-3">
          This is a mock wallet for testing the flow — plug in Razorpay Checkout for deposits and
          RazorpayX Payouts for withdrawals before going live.
        </p>
      </div>

      <h2 className="font-display text-lg font-semibold mb-3">Transaction history</h2>
      <div className="grid gap-2">
        {transactions.map((t) => (
          <div
            key={t._id}
            className="bg-surface border border-line rounded-lg px-4 py-3 flex items-center justify-between text-sm"
          >
            <div>
              <p className="font-medium capitalize">{t.type.replace("_", " ")}</p>
              <p className="text-muted text-xs">{t.note}</p>
            </div>
            <p
              className={
                t.type === "earning" || t.type === "deposit" ? "text-lime" : "text-coral"
              }
            >
              {t.type === "earning" || t.type === "deposit" ? "+" : "-"}₹{t.amount}
            </p>
          </div>
        ))}
        {transactions.length === 0 && (
          <p className="text-muted text-sm">No transactions yet.</p>
        )}
      </div>
    </div>
  );
}
