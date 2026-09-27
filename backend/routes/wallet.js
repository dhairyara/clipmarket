import express from "express";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("walletBalance");
  res.json({ walletBalance: user.walletBalance });
});

router.get("/transactions", requireAuth, async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(transactions);
});

// MOCK deposit endpoint — this is where Razorpay Checkout / Orders API plugs in.
// Real flow: create a Razorpay order server-side -> client opens Razorpay
// Checkout -> on success, verify payment signature here -> THEN credit wallet.
// For now this just credits the wallet directly so the rest of the app is testable.
router.post("/deposit", requireAuth, async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Enter a valid amount" });
  }
  const user = await User.findById(req.user.id);
  user.walletBalance += amount;
  await user.save();
  await Transaction.create({
    user: user._id,
    type: "deposit",
    amount,
    note: "Wallet top-up (mock — replace with Razorpay order verification)",
  });
  res.json({ walletBalance: user.walletBalance });
});

// MOCK payout request — real flow: call RazorpayX Payouts API with the
// user's UPI VPA/bank account after KYC, then record status via webhook.
router.post("/payout", requireAuth, async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.user.id);
  if (!amount || amount <= 0 || amount > user.walletBalance) {
    return res.status(400).json({ message: "Invalid payout amount" });
  }
  user.walletBalance -= amount;
  await user.save();
  await Transaction.create({
    user: user._id,
    type: "payout",
    amount,
    note: "Payout requested (mock — replace with RazorpayX payout call)",
  });
  res.json({ walletBalance: user.walletBalance });
});

export default router;
