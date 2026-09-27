import { useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    sourceContentUrl: "",
    ratePerThousandViews: 100,
    totalBudget: 5000,
    guidelines: "",
  });
  const [error, setError] = useState("");

  async function loadCampaigns() {
    const { data } = await client.get("/campaigns", { params: { mine: true } });
    setCampaigns(data);
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await client.post("/campaigns", form);
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        sourceContentUrl: "",
        ratePerThousandViews: 100,
        totalBudget: 5000,
        guidelines: "",
      });
      loadCampaigns();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create campaign");
    }
  }

  async function openSubmissions(campaign) {
    setSelectedCampaign(campaign);
    const { data } = await client.get(`/submissions/campaign/${campaign._id}`);
    setSubmissions(data);
  }

  async function approve(sub) {
    const finalViews = window.prompt("Confirm view count for payout:", sub.reportedViews);
    if (finalViews === null) return;
    await client.patch(`/submissions/${sub._id}/approve`, {
      finalViews: Number(finalViews),
    });
    openSubmissions(selectedCampaign);
    loadCampaigns();
  }

  async function reject(sub) {
    await client.patch(`/submissions/${sub._id}/reject`, {});
    openSubmissions(selectedCampaign);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold">Your campaigns</h1>
          <p className="text-muted text-sm mt-1">
            Wallet balance: <span className="text-lime font-medium">₹{user?.walletBalance ?? 0}</span>
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-lime text-ink font-semibold rounded-lg px-4 py-2.5 text-sm hover:opacity-90"
        >
          {showForm ? "Cancel" : "+ New campaign"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-surface border border-line rounded-xl p-6 mb-8 grid gap-4"
        >
          {error && (
            <div className="bg-coral/10 border border-coral/40 text-coral text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm text-muted mb-1">Campaign title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-ink border border-line rounded-lg px-3 py-2 outline-none focus:border-lime"
              placeholder="Clip my podcast episode #42"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Description</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-ink border border-line rounded-lg px-3 py-2 outline-none focus:border-lime"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Source content link (long video to clip from)
            </label>
            <input
              value={form.sourceContentUrl}
              onChange={(e) => setForm({ ...form, sourceContentUrl: e.target.value })}
              className="w-full bg-ink border border-line rounded-lg px-3 py-2 outline-none focus:border-lime"
              placeholder="https://youtube.com/..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1">Rate per 1,000 views (₹)</label>
              <input
                type="number"
                min={1}
                required
                value={form.ratePerThousandViews}
                onChange={(e) =>
                  setForm({ ...form, ratePerThousandViews: Number(e.target.value) })
                }
                className="w-full bg-ink border border-line rounded-lg px-3 py-2 outline-none focus:border-lime"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Total budget (₹)</label>
              <input
                type="number"
                min={1}
                required
                value={form.totalBudget}
                onChange={(e) => setForm({ ...form, totalBudget: Number(e.target.value) })}
                className="w-full bg-ink border border-line rounded-lg px-3 py-2 outline-none focus:border-lime"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Guidelines (optional)</label>
            <textarea
              value={form.guidelines}
              onChange={(e) => setForm({ ...form, guidelines: e.target.value })}
              className="w-full bg-ink border border-line rounded-lg px-3 py-2 outline-none focus:border-lime"
              rows={2}
              placeholder="No misleading titles, keep clips under 60s..."
            />
          </div>
          <p className="text-xs text-muted">
            Budget is deducted from your wallet balance now and held for this campaign. Add funds from the Wallet page if needed.
          </p>
          <button className="bg-lime text-ink font-semibold rounded-lg py-2.5 hover:opacity-90">
            Launch campaign
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {campaigns.map((c) => (
          <div
            key={c._id}
            className="bg-surface border border-line rounded-xl p-5 flex items-center justify-between"
          >
            <div>
              <h3 className="font-display font-semibold text-lg">{c.title}</h3>
              <p className="text-muted text-sm mt-1">
                ₹{c.ratePerThousandViews}/1k views · Budget ₹{c.budgetSpent}/{c.totalBudget} used
              </p>
            </div>
            <button
              onClick={() => openSubmissions(c)}
              className="text-sm border border-line rounded-lg px-3 py-2 hover:border-lime"
            >
              Review submissions
            </button>
          </div>
        ))}
        {campaigns.length === 0 && (
          <p className="text-muted text-sm">No campaigns yet. Create your first one above.</p>
        )}
      </div>

      {selectedCampaign && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold mb-4">
            Submissions for "{selectedCampaign.title}"
          </h2>
          <div className="grid gap-3">
            {submissions.map((s) => (
              <div
                key={s._id}
                className="bg-surface border border-line rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <a
                    href={s.clipUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-lime text-sm break-all"
                  >
                    {s.clipUrl}
                  </a>
                  <p className="text-muted text-xs mt-1">
                    by {s.clipper?.name} · reported {s.reportedViews} views · status: {s.status}
                  </p>
                </div>
                {s.status === "pending" && (
                  <div className="flex gap-2 shrink-0 ml-4">
                    <button
                      onClick={() => approve(s)}
                      className="bg-lime text-ink text-sm font-medium rounded-lg px-3 py-1.5"
                    >
                      Approve & pay
                    </button>
                    <button
                      onClick={() => reject(s)}
                      className="border border-line text-sm rounded-lg px-3 py-1.5 hover:border-coral hover:text-coral"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
            {submissions.length === 0 && (
              <p className="text-muted text-sm">No submissions yet for this campaign.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
