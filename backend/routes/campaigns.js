import express from "express";
import Campaign from "../models/Campaign.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// List all active campaigns (browsable by clippers), or a creator's own campaigns
router.get("/", requireAuth, async (req, res) => {
  const { mine } = req.query;
  const filter = mine === "true" ? { creator: req.user.id } : { status: "active" };
  const campaigns = await Campaign.find(filter)
    .populate("creator", "name instagramHandle")
    .sort({ createdAt: -1 });
  res.json(campaigns);
});

router.get("/:id", requireAuth, async (req, res) => {
  const campaign = await Campaign.findById(req.params.id).populate(
    "creator",
    "name instagramHandle"
  );
  if (!campaign) return res.status(404).json({ message: "Campaign not found" });
  res.json(campaign);
});

// Only creators can create campaigns. Funding the budget deducts from the
// creator's wallet balance immediately (simple escrow model for the MVP).
router.post("/", requireAuth, requireRole("creator"), async (req, res) => {
  try {
    const {
      title,
      description,
      sourceContentUrl,
      ratePerThousandViews,
      totalBudget,
      platform,
      guidelines,
    } = req.body;

    if (!title || !description || !ratePerThousandViews || !totalBudget) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const creator = await User.findById(req.user.id);
    if (creator.walletBalance < totalBudget) {
      return res.status(400).json({
        message: "Insufficient wallet balance. Add funds before creating a campaign.",
      });
    }

    const campaign = await Campaign.create({
      creator: creator._id,
      title,
      description,
      sourceContentUrl,
      ratePerThousandViews,
      totalBudget,
      platform,
      guidelines,
    });

    creator.walletBalance -= totalBudget;
    await creator.save();

    await Transaction.create({
      user: creator._id,
      type: "campaign_fund",
      amount: totalBudget,
      note: `Funded campaign "${title}"`,
      relatedCampaign: campaign._id,
    });

    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ message: "Could not create campaign", error: err.message });
  }
});

router.patch("/:id/status", requireAuth, requireRole("creator"), async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return res.status(404).json({ message: "Campaign not found" });
  if (String(campaign.creator) !== req.user.id) {
    return res.status(403).json({ message: "Not your campaign" });
  }
  campaign.status = req.body.status;
  await campaign.save();
  res.json(campaign);
});

export default router;
