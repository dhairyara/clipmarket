import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    sourceContentUrl: { type: String, default: "" }, // link to long-form video/podcast to clip from
    ratePerThousandViews: { type: Number, required: true }, // in INR
    totalBudget: { type: Number, required: true }, // in INR
    budgetSpent: { type: Number, default: 0 },
    platform: {
      type: [String],
      enum: ["instagram", "youtube_shorts", "x"],
      default: ["instagram"],
    },
    guidelines: { type: String, default: "" },
    status: { type: String, enum: ["active", "paused", "closed"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Campaign", campaignSchema);
