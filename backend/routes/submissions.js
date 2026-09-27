import express from "express";
import Submission from "../models/Submission.js";
import Campaign from "../models/Campaign.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Clipper submits a clip against a campaign
router.post("/", requireAuth, requireRole("clipper"), async (req, res) => {
  const { campaignId, clipUrl, reportedViews } = req.body;
  if (!campaignId || !clipUrl) {
    return res.status(400).json({ message: "campaignId and clipUrl are required" });
  }
  const campaign = await Campaign.findById(campaignId);
  if (!campaign || campaign.status !== "active") {
    return res.status(400).json({ message: "Campaign is not open for submissions" });
  }
  const submission = await Submission.create({
    campaign: campaignId,
    clipper: req.user.id,
    clipUrl,
    reportedViews: reportedViews || 0,
  });
  res.status(201).json(submission);
});

// Clipper: view their own submissions
router.get("/mine", requireAuth, requireRole("clipper"), async (req, res) => {
  const submissions = await Submission.find({ clipper: req.user.id })
    .populate("campaign", "title ratePerThousandViews")
    .sort({ createdAt: -1 });
  res.json(submissions);
});

// Creator: view submissions for one of their campaigns
router.get("/campaign/:campaignId", requireAuth, requireRole("creator"), async (req, res) => {
  const campaign = await Campaign.findById(req.params.campaignId);
  if (!campaign || String(campaign.creator) !== req.user.id) {
    return res.status(403).json({ message: "Not your campaign" });
  }
  const submissions = await Submission.find({ campaign: req.params.campaignId })
    .populate("clipper", "name instagramHandle")
    .sort({ createdAt: -1 });
  res.json(submissions);
});

// Creator approves a submission: calculates payout, credits clipper wallet,
// deducts from campaign's already-reserved budget.
router.patch("/:id/approve", requireAuth, requireRole("creator"), async (req, res) => {
  const { finalViews } = req.body;
  const submission = await Submission.findById(req.params.id).populate("campaign");
  if (!submission) return res.status(404).json({ message: "Submission not found" });

  const campaign = submission.campaign;
  if (String(campaign.creator) !== req.user.id) {
    return res.status(403).json({ message: "Not your campaign" });
  }
  if (submission.status !== "pending") {
    return res.status(400).json({ message: "Submission already reviewed" });
  }

  const views = finalViews ?? submission.reportedViews;
  const payout = Math.round((views / 1000) * campaign.ratePerThousandViews);
  const remainingBudget = campaign.totalBudget - campaign.budgetSpent;

  if (payout > remainingBudget) {
    return res.status(400).json({
      message: `Payout (₹${payout}) exceeds remaining campaign budget (₹${remainingBudget})`,
    });
  }

  submission.reportedViews = views;
  submission.status = "approved";
  submission.payoutAmount = payout;
  await submission.save();

  await Campaign.findByIdAndUpdate(campaign._id, {
    $inc: { budgetSpent: payout },
  });

  const clipper = await User.findById(submission.clipper);
  clipper.walletBalance += payout;
  await clipper.save();

  await Transaction.create({
    user: clipper._id,
    type: "earning",
    amount: payout,
    note: `Payout for clip on "${campaign.title}"`,
    relatedCampaign: campaign._id,
    relatedSubmission: submission._id,
  });

  submission.status = "paid";
  await submission.save();

  res.json(submission);
});

router.patch("/:id/reject", requireAuth, requireRole("creator"), async (req, res) => {
  const submission = await Submission.findById(req.params.id).populate("campaign");
  if (!submission) return res.status(404).json({ message: "Submission not found" });
  if (String(submission.campaign.creator) !== req.user.id) {
    return res.status(403).json({ message: "Not your campaign" });
  }
  submission.status = "rejected";
  submission.reviewNote = req.body.reviewNote || "";
  await submission.save();
  res.json(submission);
});

export default router;
