import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
    clipper: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    clipUrl: { type: String, required: true },
    // Views are self-reported + admin/creator-verified for MVP.
    // Later this can be swapped for an automated Instagram/YouTube API check.
    reportedViews: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "paid"],
      default: "pending",
    },
    payoutAmount: { type: Number, default: 0 },
    reviewNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);
