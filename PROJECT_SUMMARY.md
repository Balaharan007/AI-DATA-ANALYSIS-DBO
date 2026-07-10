# Insight Engine — AI Data Analyst Platform

## Folder Structure

```
C:\insight-engine\
├── README.md                     # Project overview & quick start
├── PROJECT_SUMMARY.md            # This file — conversation history & structure
├── PROCESS_OF_BACKEND.md         # Backend architecture documentation
├── PROCESS_OF_FRONTEND.md        # Frontend architecture documentation
├── images/
│   └── image.png                 # Reference image for UI/chart layout
│
├── backend/                      # FastAPI Python backend
│   ├── .env.example              # Environment variables template
│   ├── .env                      # (gitignored) — GROQ_API_KEY, MongoDB, JWT, CORS
│   ├── requirements.txt          # Python dependencies
│   ├── start_backend.bat         # Startup script (Windows)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI app entry, CORS, router registration, static files
│   │   ├── config.py             # Pydantic Settings from .env (API keys, models, CORS, MongoDB, JWT)
│   │   ├── models.py             # Pydantic schemas (mirror frontend types.ts)
│   │   ├── storage.py            # JSON+CSV file-based persistence (Store class)
│   │   ├── database.py           # MongoDB connection + indexes
│   │   ├── groq_client.py        # Groq SDK wrapper (chat, vision, whisper + 3-model fallback)
│   │   ├── routers/              # One file per API resource
│   │   │   ├── __init__.py
│   │   │   ├── auth.py           # POST /auth/signup, /auth/signin, /auth/me, /auth/signout
│   │   │   ├── datasets.py       # CRUD for uploaded datasets (upload, list, preview, delete)
│   │   │   ├── chat.py           # POST /chat, POST /voice
│   │   │   ├── analysis_router.py# Chart, anomaly, forecast, SQL, pandas, report endpoints
│   │   │   ├── dashboard.py      # GET /dashboard (KPIs + charts)
│   │   │   ├── reports.py        # List/delete reports
│   │   │   ├── history.py        # Conversation history
│   │   │   ├── automation.py     # Stub for n8n/Gmail/Telegram
│   │   │   └── settings_router.py# App settings CRUD
│   │   └── services/             # Business logic
│   │       ├── __init__.py
│   │       ├── auth_service.py   # JWT (HS256), bcrypt, MongoDB user CRUD
│   │       ├── dataset_service.py# Upload, validation, cleaning, quality score, join-key detection
│   │       ├── analysis.py       # Chart specs, anomalies (Z-score+IQR), Prophet forecast, SQL/pandas gen+exec, dashboard
│   │       ├── chat_service.py   # Agent: intent classification → tool routing → structured narrator
│   │       ├── report_service.py # PDF (ReportLab) + DOCX (python-docx) with 2 charts, heuristic insights
│   │       ├── forecast_service.py# Advanced forecasting pipeline (Prophet + linear fallback)
│   │       ├── anomaly_service.py# Dedicated anomaly detection service
│   │       ├── drive_service.py  # Google Drive upload stub
│   │       └── google_drive_service.py # Google Drive API integration
│   └── data/                     # Persisted data (gitignored)
│       ├── datasets/             # Uploaded CSV files (ds_{id}.csv)
│       ├── reports/              # Generated PDF/DOCX reports
│       ├── meta.json             # Dataset metadata, history, settings, users
│       └── history.json          # Chat/analysis history log
│
├── frontend/                     # React 19 + TanStack Start (SSR)
│   ├── package.json              # Node dependencies
│   ├── vite.config.ts            # Vite config
│   ├── start_frontend.bat        # Startup script (Windows)
│   ├── tsconfig.json
│   ├── components.json           # shadcn/ui config
│   ├── .env.example              # VITE_API_BASE_URL, VITE_APP_NAME
│   └── src/
│       ├── routes/               # TanStack Router pages
│       │   ├── __root.tsx        # Root layout: providers, sidebar, navbar, auth gate
│       │   ├── index.tsx         # Landing: quick actions, recent datasets, recent reports
│       │   ├── chat.tsx          # AI chat with dataset selector, ExecutionTimeline
│       │   ├── dashboard.tsx     # Auto-generated BI dashboard (KPIs + 5 charts)
│       │   ├── datasets.tsx      # Dataset list + upload button
│       │   ├── datasets.$id.tsx  # Dataset detail: preview, schema, quality tabs
│       │   ├── datasets.upload.tsx# Drag-drop upload (CSV, Excel, images of tables)
│       │   ├── reports.tsx       # Report list + generate (PDF/DOCX)
│       │   ├── history.tsx       # Unified timeline (chat, analysis, reports)
│       │   ├── settings.tsx      # Theme, API URL, Groq key, dataset defaults
│       │   ├── automation.tsx    # Automation/workflow runner
│       │   └── sitemap[.]xml.ts  # Sitemap generation
│       ├── components/
│       │   ├── ui/               # shadcn/ui primitives (Button, Card, Dialog, etc.)
│       │   ├── app/              # App layout (AppSidebar, TopNavbar, PageHeader, KpiCard, ChartCard, etc.)
│       │   ├── chat/             # ChatMessage, ChatInput, ExecutionTimeline
│       │   ├── charts/           # ChartCard — Recharts (simple) + Plotly (complex) hybrid
│       │   └── auth/             # AuthModal (full-page Sign In/Up), AuthPage wrapper
│       ├── context/
│       │   └── AuthContext.tsx   # React context: user, isLoading, isAuthenticated, login, signup, logout, refreshUser
│       ├── hooks/                # use-theme, use-mobile
│       ├── lib/
│       │   ├── api/              # Typed API layer
│       │   │   ├── client.ts     # Axios instance + interceptors (auth, error handling)
│       │   │   ├── endpoints.ts  # API functions (listDatasets, upload, chat, generateChart, etc.)
│       │   │   └── types.ts      # TypeScript interfaces mirroring backend Pydantic models
│       │   ├── error-*.ts        # Error handling utilities
│       │   └── utils.ts          # cn, formatters, etc.
│       ├── routeTree.gen.ts      # Auto-generated route tree
│       ├── router.tsx            # Router instance + QueryClient provider
│       ├── server.ts             # TanStack Start server entry (SSR)
│       ├── start.tsx             # Client entry (hydration)
│       └── styles.css            # Tailwind v4 + global styles + CSS variables
```

---

## Conversation History — Changes Made

### Session 1: Initial Setup & Model Config
- **Model switch**: Default text model `openai/gpt-oss-120b` → `llama-3.3-70b-versatile` (removed `meta-llama/` prefix causing 404)
- **Fallback removed**: `kimi/kimi-k2-instruct` inaccessible — fallback chain now only tries if configured
- **Vision model**: Also switched to `llama-3.3-70b-versatile` (was `meta-llama/llama-4-scout-17b-16e-instruct`)

### Session 2: Chart Engine Migration
- **Plotly → Recharts**: `ChartCard.tsx` rewritten for bar, line, area, pie, scatter, histogram
- **Plotly retained** as lazy fallback for complex types (treemap, heatmap, radar, box)
- **Traces field removed**: Backend no longer sends unused Plotly trace configs (fixed SSR crashes)

### Session 3: Structured Responses & Reports
- **Narrator prompt rewritten**: Forces structured output with emoji headers (`### 📋 Key Points`), `• ` bullets with bolded metrics, 100-300 words, no prose paragraphs
- **Report generation overhaul**: `report_service.py` generates **5 auto-charts** per dataset + **both PDF and DOCX**
- **Section parsing**: LLM output parsed into Executive Summary, Key Metrics (5 bullets), Insights, Anomalies, Recommendations

### Session 4: Chart Fixes & Dashboard
- **Legend**: Always shown, top-right corner
- **Fixed height**: Charts use `h-[22rem]` to prevent overlap
- **Dashboard dataset selector**: Pick which dataset drives the dashboard
- **5 dashboard charts**: Bar, Pie, Line, Histogram, Scatter — each with plain-English description
- **Richer KPIs**: Total + Average per numeric column, auto M-formatting

### Session 5: Reporting Enhancements
- **DOCX support**: python-docx generates .docx alongside PDF
- **Chart descriptions**: Each report chart includes description, type, axis info
- **Colorful bars**: Single-series bars use multi-color palette (one color per data point)
- **Green dot bullets**: Chat list items render with green `•` markers

### Session 6: Authentication System (NEW)
- **Full auth flow**: JWT (HS256) + bcrypt + MongoDB user storage
- **Backend**: `auth_service.py` (signup, signin, token decode, user lookup), `auth.py` router, `database.py` (MongoDB + indexes)
- **Frontend**: `AuthContext.tsx` (state + methods), `AuthModal.tsx` (full-page Sign In/Up with tabs), `AuthPage.tsx` (wrapper), auth gate in `__root.tsx`
- **Auth UX**: App shows loading → full-page auth screen if unauthenticated → full app (Sidebar + Navbar + content) only after successful auth
- **TopNavbar**: User avatar dropdown with Settings/Logout; Login button redirects to `/` (auth gate)

### Session 7: Advanced Analytics & Infrastructure (NEW)
- **Forecasting pipeline**: `forecast_service.py` + `analysis.py` — LLM query parsing → Prophet (with seasonality) → linear fallback → chart spec with confidence intervals
- **Anomaly detection**: `anomaly_service.py` + `analysis.py` — Z-score (>3) + IQR (1.5×) combined, LLM explanations
- **Sandboxed pandas**: Regex guard + restricted builtins + ThreadPoolExecutor timeout (30s)
- **Multi-dataset joins**: Auto-detect shared columns with high uniqueness → left-deep merge; fallback to concat
- **Report Service v2**: 2 charts (bar + line) with heuristic insights (no extra LLM calls), matplotlib rendering, PDF + DOCX, optional Google Drive upload
- **Google Drive integration**: `google_drive_service.py` + `drive_service.py` for report backup
- **MongoDB persistence**: Users, datasets metadata, settings stored in MongoDB; CSV files on disk

---

## Quick Start

```bash
# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env → add GROQ_API_KEY, MONGODB_URL, JWT_SECRET_KEY, CORS_ORIGINS
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` (frontend) or `http://localhost:8000/docs` (API docs).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TanStack Start (SSR), TanStack Router, TanStack Query v5, Vite, Tailwind CSS v4, Recharts, Plotly.js, Radix UI, Lucide React |
| **Backend** | FastAPI, Python 3.11+, Pydantic v2, DuckDB (SQL execution), pandas, Prophet (forecasting), ReportLab (PDF), python-docx (DOCX) |
| **AI** | Groq API: `llama-3.3-70b-versatile` (text/vision), `whisper-large-v3-turbo` (voice), 3-model fallback chain |
| **Auth** | JWT (HS256), bcrypt, MongoDB (users), 7-day token expiry |
| **Storage** | File-based (CSV + JSON) for datasets/reports; MongoDB for users/settings |
| **Reports** | ReportLab (PDF), python-docx (DOCX), matplotlib (chart rendering) |
| **Optional** | Google Drive API (report backup) |

---

## Key Architecture Decisions

| Principle | Implementation |
|-----------|----------------|
| **Contract-first** | Pydantic models = TypeScript types; routers mirror `endpoints.ts` 1:1 |
| **Swappable storage** | `storage.py` is only persistence layer; routers know nothing about files |
| **LLM as orchestrator** | Chat agent classifies intent → calls deterministic Python (SQL, pandas, stats) |
| **Sandboxed execution** | Regex guard + restricted globals + 30s timeout (guardrail, not security boundary) |
| **Model fallback chain** | Auto-retry on 429/500/503 across 3 Groq models |
| **Multi-dataset joins** | Auto-detect join keys (high uniqueness + common names); fallback to concat |
| **Observability** | Execution trace in every chat response (steps, durations, inputs/outputs) |
| **Auth-gated UI** | SSR-compatible auth check in root layout; no app shell until authenticated |

---

## API Overview (Selected)

| Feature | Endpoint | Method |
|---------|----------|--------|
| **Auth** | `/auth/signup`, `/auth/signin`, `/auth/me` | POST, POST, GET |
| **Datasets** | `/upload`, `/datasets`, `/datasets/{id}/preview` | POST, GET, GET |
| **Chat** | `/chat`, `/voice` | POST, POST |
| **Analysis** | `/generate-chart`, `/detect-anomaly`, `/forecast`, `/generate-sql`, `/generate-report` | POST |
| **Dashboard** | `/dashboard?dataset_id=...` | GET |
| **Reports** | `/reports`, `/reports/{id}` | GET, DELETE |
| **History** | `/history` | GET |
| **Settings** | `/settings` | GET, PUT |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `GROQ_API_KEY` not set | Check `.env` exists with valid key |
| CORS error | Add frontend origin to `CORS_ORIGINS` in `.env` |
| Upload fails (413) | Increase `MAX_UPLOAD_MB` or nginx `client_max_body_size` |
| Pandas timeout | Increase `PANDAS_TIMEOUT_SECONDS` or optimize code |
| DuckDB join fails | Verify column names/dtypes match; falls back to concat |
| PDF generation fails | `pip install kaleido` for Plotly static export |
| MongoDB connection failed | Check `MONGODB_URL` in `.env`; ensure MongoDB running |
| JWT errors | Verify `JWT_SECRET_KEY` in `.env` (min 32 chars) |
| Prophet not installed | `pip install prophet` (requires C++ build tools on Windows) |

---

## Useful Commands

```bash
# Backend
cd backend
pytest                 # Run tests
mypy app/              # Type check
ruff check app/        # Lint
ruff format app/       # Format

# Frontend
cd frontend
npm run lint           # ESLint
npm run format         # Prettier
npx tsc --noEmit       # Type check
npm run build          # Production build → .output/

# Check Groq models
curl -H "Authorization: Bearer $GROQ_API_KEY" https://api.groq.com/openai/v1/models
```

---

## Related Documentation

- **Backend Deep Dive**: [`PROCESS_OF_BACKEND.md`](./PROCESS_OF_BACKEND.md) — 19 sections covering config, models, storage, services, routers, Groq client, auth, sandbox, deployment
- **Frontend Deep Dive**: [`PROCESS_OF_FRONTEND.md`](./PROCESS_OF_FRONTEND.md) — 13 sections covering routing, state, components, page flows, API contract, patterns, deployment
- **Backend README**: [`backend/README.md`](./backend/README.md)