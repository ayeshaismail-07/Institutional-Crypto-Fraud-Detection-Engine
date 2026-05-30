# Institutional Crypto Fraud Detection Engine

A real-time, AI-powered cryptocurrency threat analytics platform that ingests live Binance trade streams and runs them through a multi-agent detection pipeline to surface anomalous transactions and flag high-risk wallet activity.

---

## Overview

This platform continuously monitors BTC, ETH, and SOL trade feeds from Binance and scores every transaction for fraud probability using a layered agent architecture. When the Gemini API key is configured, a language model provides contextual threat explanations for each alert. Without it, the system falls back to a deterministic heuristic model that still produces full risk assessments.

The frontend is a cyberpunk-styled React dashboard with four views: a live overview, a real-time detection feed, a wallet intelligence panel, and an analytics section with historical anomaly charts.

---

## Features

- **Live Binance WebSocket stream** — ingests real-time trade data for BTCUSDT, ETHUSDT, and SOLUSDT
- **6-agent detection pipeline** — each agent handles a distinct stage of the fraud analysis workflow
- **AI-generated threat reasoning** — Gemini produces natural-language explanations for flagged transactions (optional)
- **Risk-tiered alerts** — transactions are classified as LOW / MEDIUM / HIGH / CRITICAL
- **Wallet Intelligence panel** — pre-profiled suspect wallets with behavioral indicators, entity links, and risk scores
- **Analytics dashboard** — anomaly score timelines, per-asset averages, and alert breakdowns via Recharts
- **Persistent emulated database** — state is stored in `data/db.json` and survives restarts
- **REST + WebSocket API** — frontend connects via `/ws/live-alerts`; REST endpoints available for status, alerts, and transactions

---

## Agent Pipeline

| Agent | Role |
|---|---|
| **DataAgent** | Ingests raw Binance trade packets and normalizes price, quantity, USD value, and timestamp |
| **FeatureAgent** | Maintains 100-trade sliding windows per symbol; computes volatility, volume deviation, and price spikes |
| **MLAgent** | Isolation Forest–style anomaly scoring using the multi-feature vectors from FeatureAgent |
| **GeminiAgent** | Calls Gemini to generate a 1–2 sentence contextual threat explanation (requires API key) |
| **ValidatorAgent** | Applies a false-positive filter and computes a final validator confidence score |
| **AlertAgent** | Broadcasts confirmed alerts to all connected UI clients over WebSocket |

---

## Tech Stack

- **Runtime** — Node.js with TypeScript (`tsx` for development, `esbuild` for production)
- **Backend** — Express + `ws` WebSocket server
- **Frontend** — React 19 + Vite + Tailwind CSS v4
- **AI** — Google Gemini via `@google/genai`
- **Charts** — Recharts
- **Animations** — Motion (Framer Motion)
- **Icons** — Lucide React

---

## Prerequisites

- Node.js (v18 or later recommended)
- A [Gemini API key](https://aistudio.google.com/app/apikey) *(optional — heuristic fallback runs without one)*

---

## Getting Started

**1. Install dependencies**

```bash
npm install
```

**2. Configure environment**

Copy `.env.example` to `.env.local` and set your Gemini API key:

```bash
cp .env.example .env.local
```

```env
GEMINI_API_KEY=your_key_here
APP_URL=http://localhost:3000
```

**3. Start the development server**

```bash
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000). The Binance stream connects automatically on startup.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build frontend with Vite and bundle server with esbuild |
| `npm start` | Run the production build |
| `npm run lint` | TypeScript type checking |
| `npm run clean` | Remove build artifacts |

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/status` | System health: stream status, threat level, agent count, uptime |
| `GET` | `/api/alerts?limit=50` | Recent fraud alerts |
| `GET` | `/api/latest?limit=100` | Recent normalized transactions |
| `GET` | `/api/agents/status` | Per-agent status and recent logs |
| `POST` | `/api/system/reset` | Clear and re-seed the database |
| `WS` | `/ws/live-alerts` | Real-time stream of alerts and transactions to the UI |

---

## Project Structure

```
├── backend/
│   ├── agents.ts        # All 6 agents + Binance WebSocket client
│   └── database.ts      # Emulated JSON database with seed data
├── src/
│   ├── components/
│   │   ├── CyberGrid.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── LiveDetectionFeed.tsx
│   │   ├── AlertCenter.tsx
│   │   ├── WalletIntelligence.tsx
│   │   └── Analytics.tsx
│   ├── types.ts          # Shared TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── server.ts             # Express + WebSocket server entrypoint
├── data/
│   └── db.json           # Persistent emulated database
└── .env.example
```

---

## Notes

- The wallet intelligence panel includes a pre-seeded registry of suspect wallet profiles (mixer receivers, flash loan exploiters, Sybil attackers) for demonstration purposes.
- The database is an in-process JSON file (`data/db.json`). For production use, replace `EmulatedDatabase` in `backend/database.ts` with a real database.
- The `GeminiAgent` uses `gemini-2.5-flash`. If the API key is absent or set to the placeholder value, it logs a notice and the pipeline continues using heuristic rules only.
