# Insight Engine — Backend (FastAPI + Groq)

Backend for the "Ada Analyst" AI Data Analyst platform. Implements every core feature
from the spec, matching the typed API contract already defined in the frontend
(`src/lib/api/{client,endpoints,types}.ts`) exactly.

## Features

- **Upload & validate** CSV, Excel (`.xlsx`/`.xls`), and **images of tables** (photos/
  screenshots of spreadsheets or tables) — images are converted to CSV automatically
  using a Groq vision model (`meta-llama/llama-4-scout-17b-16e-instruct` by default).
- **Multiple CSV files**: each upload becomes its own dataset. In chat / analysis calls,
  pass `dataset_id` as a comma-separated list (`"ds_1,ds_2"`) or `"all"` to analyze
  across every uploaded dataset — the backend auto-joins on shared key columns where
  possible, otherwise concatenates.
- **Natural language Q&A** over the data (`/chat`), with conversation memory per
  `conversation_id`.
- **Business insights & summaries**, **anomaly detection** (z-score + IQR, explained in
  plain English), **forecasting** (linear trend, auto-detects a date/period column),
  **chart generation** (bar/line/pie/scatter/histogram/etc., LLM picks the right
  columns/aggregation), **SQL generation** (DuckDB, actually executed against the
  data — not just text), **pandas code generation** (sandboxed execution), and
  **PDF report generation**.
- **Voice**: `/voice` accepts an audio blob and transcribes it with Groq Whisper before
  routing it through the same chat agent.

## Setup

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # optional but recommended
pip install -r requirements.txt
cp .env.example .env   # then edit .env and set GROQ_API_KEY
uvicorn app.main:app --reload --port 8000
```

Get a free Groq API key at https://console.groq.com/keys.

The server starts at `http://localhost:8000`. Interactive API docs are at
`http://localhost:8000/docs`.

## Connecting the frontend

In `frontend/.env`, set:

```
VITE_API_BASE_URL=http://localhost:8000
```

and make sure that same origin (e.g. `http://localhost:3000`) is listed in
`CORS_ORIGINS` in `backend/.env`.

## Models

Groq's model lineup changes frequently — override any of these in `.env` if a model is
renamed or deprecated (check https://console.groq.com/docs/models):

| Purpose            | Env var             | Default                                    |
|--------------------|----------------------|---------------------------------------------|
| Reasoning / chat / SQL / pandas / insights | `GROQ_TEXT_MODEL`   | `llama-3.3-70b-versatile` |
| Image → table extraction                   | `GROQ_VISION_MODEL` | `meta-llama/llama-4-scout-17b-16e-instruct` |
| Voice transcription                        | `GROQ_WHISPER_MODEL`| `whisper-large-v3-turbo` |

**Automatic fallback chain on rate-limit / overload errors:**  
`GROQ_TEXT_MODEL` → `GROQ_FALLBACK_TEXT_MODEL` (`kimi-k2-instruct`) → hardcoded `qwen3-32b`  
If a model returns HTTP 429/503/500, the client automatically retries with the next in chain.

## Architecture

```
app/
  main.py              FastAPI app, CORS, static file serving for generated reports
  config.py             Settings (.env)
  models.py              Pydantic schemas mirroring the frontend's types.ts
  storage.py             JSON+CSV backed persistence (datasets, reports, history, conversations)
  groq_client.py          Groq SDK wrapper (chat, vision, whisper)
  services/
    dataset_service.py    Upload/validate CSV/Excel/image, cleaning, quality score, join-key detection
    analysis.py            Chart building, anomaly detection, forecasting, SQL/pandas gen+exec, dashboard
    chat_service.py         Agent: classifies intent, routes to the right tool, composes chat responses
    report_service.py       PDF report generation (reportlab)
  routers/                One file per resource, matching frontend/src/lib/api/endpoints.ts 1:1
```

## Notes & extension points

- **Storage** is file-based (`data/`) for simplicity — swap `app/storage.py` for a real
  database (Postgres, etc.) without touching the routers.
- **Automation** (`/automation`) is a functional stub — wire `app/routers/automation.py`
  up to your n8n webhook / Gmail / Google Drive calls for Gmail, Telegram, Drive.
- **Sandboxed pandas execution**: generated pandas code runs with a restricted builtins
  set and a regex guard against `import`/`open`/`exec`/etc. It's best-effort sandboxing,
  not a hard security boundary — don't expose this server to untrusted users without
  hardening further (e.g. run in a subprocess with resource limits).
- **Multiple CSVs**: if your two files are logically one dataset (e.g. orders.csv +
  customers.csv sharing a `customer_id`), upload both and query with
  `dataset_id: "ds_1,ds_2"` — the backend will inner/outer-join on shared unique-ish
  columns automatically.
