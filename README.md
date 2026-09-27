# ClipMarket — MVP

A Whop-style marketplace connecting content creators with clippers, built for India.
Creators fund campaigns at a rate per 1,000 views; clippers submit clips and get paid
from an internal wallet once views are verified.

Stack: **React + Vite + Tailwind** (frontend), **Node + Express + MongoDB** (backend).

## What's included

- Signup/login with roles (creator / clipper), JWT auth
- Creator: create campaigns, fund them from wallet, review + approve/reject submissions
- Clipper: browse open campaigns, submit clip links, track submission status
- Wallet: internal balance, deposit/payout endpoints, transaction history
- Payment integration is **mocked** (direct wallet credit/debit) with clear comments
  showing exactly where Razorpay Checkout (deposits) and RazorpayX Payouts (withdrawals)
  plug in — see `backend/routes/wallet.js`

## What's NOT included (by design, for MVP scope)

- Real Razorpay integration (needs your live API keys + webhook signature verification)
- Automated view tracking via Instagram/YouTube APIs (currently self-reported +
  creator-verified — see the roadmap notes in chat for how to add this later)
- Email verification, password reset
- File uploads (clips are submitted as links, not uploaded video files)

## Run it locally

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI (local MongoDB or a free MongoDB Atlas cluster)
#            set JWT_SECRET to any long random string
npm run dev
```

Backend runs on `http://localhost:5000`.

You need MongoDB running. Easiest options:
- Install MongoDB Community locally, or
- Use a free MongoDB Atlas cluster (atlas.mongodb.com) and paste its connection
  string into `MONGO_URI`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and talks to the backend at
`http://localhost:5000/api` by default (change via a `.env` file with
`VITE_API_URL=...` if needed).

### 3. Try the flow

1. Sign up as a **Creator**, go to Wallet, "Add funds" (mock deposit, e.g. ₹5000)
2. Create a campaign (e.g. ₹100/1,000 views, ₹5000 budget)
3. Sign up as a **Clipper** in a new browser/incognito tab, browse campaigns, submit a clip link
4. Back as the Creator, go to the campaign → Review submissions → Approve & pay
5. Check the Clipper's wallet — the payout should reflect there

## Next steps to take this from MVP to real product

1. **Razorpay integration** — replace the mock `/wallet/deposit` and `/wallet/payout`
   routes with real Razorpay Orders (deposits) and RazorpayX Payouts (withdrawals) API calls
2. **View verification** — start with manual admin review (screenshots), then move to
   Instagram Graph API / YouTube Data API for automated view counts
3. **Business registration** — OPC or LLP, since you're moving real user money
4. **Deploy** — backend on Render/Railway, frontend on Vercel, MongoDB Atlas for the database
5. **Add**: leaderboard, ratings, in-app chat, dispute flow (see feature list from earlier chat)

## Folder structure

```
clipmarket/
├── backend/
│   ├── models/       User, Campaign, Submission, Transaction
│   ├── routes/       auth, campaigns, submissions, wallet
│   ├── middleware/   auth.js (JWT guard + role guard)
│   └── server.js
└── frontend/
    └── src/
        ├── pages/    Landing, Login, Signup, CreatorDashboard, ClipperDashboard, Wallet
        ├── context/  AuthContext.jsx
        └── api/      client.js (axios instance)
```
