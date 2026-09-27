import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <h1 className="font-display text-5xl md:text-6xl font-semibold leading-tight">
        Creators fund clips.
        <br />
        <span className="text-lime">Clippers get paid per view.</span>
      </h1>
      <p className="text-muted mt-6 max-w-xl mx-auto">
        ClipMarket connects Indian creators with editors who turn long videos and podcasts
        into short clips — with transparent, view-based payouts.
      </p>
      <div className="flex justify-center gap-4 mt-10">
        <Link
          to="/signup"
          className="bg-lime text-ink font-semibold rounded-lg px-6 py-3 hover:opacity-90"
        >
          Start as a clipper
        </Link>
        <Link
          to="/signup"
          className="border border-line rounded-lg px-6 py-3 hover:border-lime"
        >
          Launch a campaign
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-20 text-left">
        <div className="bg-surface border border-line rounded-xl p-5">
          <p className="text-coral font-display font-semibold mb-1">1. Fund a campaign</p>
          <p className="text-muted text-sm">
            Creators set a rate per 1,000 views and a total budget for clippers to compete for.
          </p>
        </div>
        <div className="bg-surface border border-line rounded-xl p-5">
          <p className="text-coral font-display font-semibold mb-1">2. Clip and submit</p>
          <p className="text-muted text-sm">
            Clippers cut the best moments, post to Instagram or YouTube Shorts, and submit the link.
          </p>
        </div>
        <div className="bg-surface border border-line rounded-xl p-5">
          <p className="text-coral font-display font-semibold mb-1">3. Get paid</p>
          <p className="text-muted text-sm">
            Once views are verified, payouts land straight in the clipper's wallet.
          </p>
        </div>
      </div>
    </div>
  );
}
