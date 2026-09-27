import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["deposit", "payout", "campaign_fund", "earning"],
      required: true,
    },
    amount: { type: Number, required: true }, // INR, positive number; sign implied by type
    note: { type: String, default: "" },
    relatedCampaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
    relatedSubmission: { type: mongoose.Schema.Types.ObjectId, ref: "Submission" },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
