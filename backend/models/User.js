import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["creator", "clipper"], required: true },
    // simple internal wallet balance in paise (INR smallest unit) to avoid float issues
    walletBalance: { type: Number, default: 0 },
    bio: { type: String, default: "" },
    instagramHandle: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
