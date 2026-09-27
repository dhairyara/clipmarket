import { useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

const statusColor = {
  pending: "text-muted",
  approved: "text-lime",
  paid: "text-lime",
  rejected: "text-coral",
};

export default function ClipperDashboard() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [submitFor, setSubmitFor] = useState(null);
  const [clipUrl, setClipUrl] = useState("");
  const [reportedViews, setReportedViews] = useState("");
  const [tab, setTab] = useState("browse");

  async function loadCampaigns() {
    const { data } = await client.get("/campaigns");
    setCampaigns(data);
  }

  async function loadMySubmissions() {
    const { data } = await client.get("/submissions/mine");
    setMySubmissions(data);
  }

  useEffect(() => {
    loadCampaigns();
    loadMySubmissions();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await client.post("/submissions", {
      campaignId: submitFor._id,
      clipUrl,
      reportedViews: Number(reportedViews) || 0,
    });
    setSubmitFor(null);
    setClipUrl("");
    setReportedViews("");
    loadMySubmissions();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold">Find campaigns to clip</h1>
          <p className="text-muted text-sm mt-1">
            Wallet balance: <span className="text-lime font-medium">₹{user?.walletBalance ?? 0}</span>
          </p>
        </div>
        <div className="flex gap-2 bg-surface border border-line rounded-lg p-1">
          <button
            onClick={() => setTab("browse")}
            className={`text-sm px-3 py-1.5 rounded-md ${
              tab === "browse" ? "bg-lime text-ink" : "text-muted"
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setTab("mine")}
            className={`text-sm px-3 py-1.5 rounded-md ${
              tab === "mine" ? "bg-lime text-ink" : "text-muted"
            }`}
          >
            My submissions
          </button>
        </div>
      </div>

      {tab === "browse" && (
        <div className="grid gap-4">
          {campaigns.map((c) => (
            <div key={c._id} className="bg-surface border border-line rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-semibold text-lg">{c.title}</h3>
                  <p className="text-muted text-sm mt-1">{c.description}</p>
                  <p className="text-sm mt-2">
                    <span className="text-lime font-medium">
                      ₹{c.ratePerThousandViews}/1,000 views
                    </span>{" "}
                    <span className="text-muted">
                      · ₹{c.totalBudget - c.budgetSpent} budget remaining
                    </span>
                  </p>
                  {c.sourceContentUrl && (
                    <a
                      href={c.sourceContentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-muted underline block mt-1"
                    >
                      View source content
                    </a>
                  )}
                </div>
                <button
                  onClick={() => setSubmitFor(c)}
                  className="shrink-0 bg-lime text-ink text-sm font-medium rounded-lg px-3 py-2"
                >
                  Submit a clip
                </button>
              </div>
            </div>
          ))}
          {campaigns.length === 0 && (
            <p className="text-muted text-sm">No active campaigns right now. Check back soon.</p>
          )}
        </div>
      )}

      {tab === "mine" && (
        <div className="grid gap-3">
          {mySubmissions.map((s) => (
            <div
              key={s._id}
              className="bg-surface border border-line rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-sm">{s.campaign?.title}</p>
                <a href={s.clipUrl} target="_blank" rel="noreferrer" className="text-xs text-muted break-all">
                  {s.clipUrl}
                </a>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className={`text-sm font-medium ${statusColor[s.status]}`}>{s.status}</p>
                {s.payoutAmount > 0 && (
                  <p className="text-xs text-muted">₹{s.payoutAmount} earned</p>
                )}
              </div>
            </div>
          ))}
          {mySubmissions.length === 0 && (
            <p className="text-muted text-sm">You haven't submitted any clips yet.</p>
          )}
        </div>
      )}

      {submitFor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-10">
          <form
            onSubmit={handleSubmit}
            className="bg-surface border border-line rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="font-display font-semibold text-lg mb-4">
              Submit clip for "{submitFor.title}"
            </h3>
            <label className="block text-sm text-muted mb-1">Clip link (Instagram/YouTube)</label>
            <input
              required
              value={clipUrl}
              onChange={(e) => setClipUrl(e.target.value)}
              className="w-full bg-ink border border-line rounded-lg px-3 py-2 mb-4 outline-none focus:border-lime"
              placeholder="https://instagram.com/reel/..."
            />
            <label className="block text-sm text-muted mb-1">
              Current view count (self-reported, creator will verify)
            </label>
            <input
              type="number"
              min={0}
              value={reportedViews}
              onChange={(e) => setReportedViews(e.target.value)}
              className="w-full bg-ink border border-line rounded-lg px-3 py-2 mb-6 outline-none focus:border-lime"
            />
            <div className="flex gap-3">
              <button className="flex-1 bg-lime text-ink font-semibold rounded-lg py-2.5">
                Submit
              </button>
              <button
                type="button"
                onClick={() => setSubmitFor(null)}
                className="flex-1 border border-line rounded-lg py-2.5"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
