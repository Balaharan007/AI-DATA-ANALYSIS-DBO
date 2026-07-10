# Insight Engine — Backend Process Documentation

> **Tech Stack:** Python 3.11+ • FastAPI • Pydantic v2 • Groq (LLM, Vision, Whisper) • DuckDB • Pandas • Prophet • ReportLab • python-docx • MongoDB (Auth) • Uvicorn

---

## 1. Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app, CORS, routers, static files, health
│   ├── config.py            # Pydantic Settings (.env)
│   ├── models.py            # Pydantic models (mirror frontend types.ts)
│   ├── storage.py           # JSON + CSV file-based persistence
│   ├── database.py          # MongoDB connection + indexes
│   ├── groq_client.py       # Groq SDK wrapper (chat, vision, whisper + 3-model fallback)
│   ├── routers/             # One file per API resource
│   │   ├── __init__.py
│   │   ├── auth.py          # POST /auth/signup, /auth/signin, /auth/me, /auth/signout
│   │   ├── datasets.py      # POST /upload, GET /datasets, GET /datasets/{id}, /preview, DELETE
│   │   ├── chat.py          # POST /chat, POST /voice
│   │   ├── analysis_router.py # /generate-chart, /detect-anomaly, /forecast, /generate-sql, /generate-report
│   │   ├── dashboard.py     # GET /dashboard
│   │   ├── reports.py       # GET /reports, DELETE /reports/{id}
│   │   ├── history.py       # GET /history
│   │   ├── settings_router.py # GET/PUT /settings
│   │   └── automation.py    # GET/POST /automation (stub)
│   └── services/            # Business logic
│       ├── __init__.py
│       ├── auth_service.py      # JWT (HS256), bcrypt, MongoDB user CRUD
│       ├── dataset_service.py   # Upload, validation, cleaning, quality score, join-key detection
│       ├── analysis.py          # Chart specs, anomalies (Z-score+IQR), forecast, SQL/pandas gen+exec, dashboard
│       ├── chat_service.py      # Agent: intent classification → tool routing → structured narrator
│       ├── report_service.py    # PDF (ReportLab) + DOCX (python-docx) with 2 charts, heuristic insights
│       ├── forecast_service.py  # Advanced forecasting pipeline (Prophet + linear fallback)
│       ├── anomaly_service.py   # Dedicated anomaly detection service
│       ├── drive_service.py     # Google Drive upload stub
│       └── google_drive_service.py # Google Drive API integration
├── data/                    # Persistent storage (gitignored)
│   ├── datasets/           # CSV files (ds_{id}.csv)
│   ├── reports/            # Generated PDF/DOCX reports
│   ├── meta.json           # Dataset metadata, history, settings
│   └── history.json        # Chat/analysis history log
├── requirements.txt
├── .env.example
├── .env                    # (gitignored) — GROQ_API_KEY, MongoDB, JWT, CORS
└── README.md
```

---

## 2. Configuration (`app/config.py`)

```python
class Settings(BaseSettings):
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    env: str = "development"

    # CORS
    cors_origins: str = "http://localhost:3000,http://localhost:5173,http://localhost:8080"
    cors_origin_regex: str | None = r"http://(localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?"

    # Groq
    groq_api_key: str = ""
    groq_text_model: str = "llama-3.3-70b-versatile"
    groq_fallback_text_model: str = "kimi-k2-instruct"
    groq_vision_model: str = "llama-3.3-70b-versatile"
    groq_whisper_model: str = "whisper-large-v3-turbo"

    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "information_users"
    mongodb_users_collection: str = "users"

    # JWT
    jwt_secret_key: str = "your-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60 * 24 * 7  # 7 days

    # Storage
    data_dir: str = "./data"
    max_upload_mb: int = 50
    pandas_timeout_seconds: int = 30

    # Google Drive (optional)
    google_drive_enabled: bool = False
    google_drive_credentials_path: str = ""
    google_drive_folder_id: str = ""
```

---

## 3. Data Models (`app/models.py`)

All Pydantic models mirror `frontend/src/lib/api/types.ts` exactly.

### Core Models
```python
class Dataset(BaseModel):
    id: str                    # ds_{uuid}
    name: str
    type: str                  # "csv" | "pdf" | "docx" | "image"
    rows: int
    columns: int
    size_bytes: int
    quality_score: float | None
    uploaded_at: str
    status: str = "ready"
    detected_tables: int | None = None
    detected_text: int | None = None
    missing_values: int | None = None
    possible_join_keys: list[str] | None = None

class ChartSpec(BaseModel):
    id: str
    title: str
    type: str                  # bar, line, pie, scatter, histogram, area, heatmap, treemap, box, radar, bubble, waterfall, sunburst
    description: str | None = None
    x_key: str | None = None
    y_keys: list[str] | None = None
    data: list[dict[str, Any]]
    meta: dict[str, Any] | None = None

class KPI(BaseModel):
    id: str
    label: str
    value: Any
    delta: float | None = None
    format: str = "number"

class DashboardResponse(BaseModel):
    kpis: list[KPI]
    charts: list[ChartSpec]
    filters: dict[str, Any] | None = None

class ChatBlock(BaseModel):
    type: str
    text: str | None = None
    markdown: str | None = None
    columns: list[str] | None = None
    rows: list[dict[str, Any]] | None = None
    chart: ChartSpec | None = None
    language: str | None = None
    code: str | None = None
    url: str | None = None
    alt: str | None = None
    name: str | None = None
    status: str | None = None

class ExecutionStep(BaseModel):
    id: str
    label: str
    status: str              # pending | running | completed | failed
    detail: str | None = None

class ChatMessage(BaseModel):
    id: str
    role: str                # user | assistant | system
    created_at: str
    blocks: list[ChatBlock]
    execution: list[ExecutionStep] | None = None

class ChatRequest(BaseModel):
    message: str
    dataset_id: str | None = None      # "ds_1" | "ds_1,ds_2" | "all"
    conversation_id: str | None = None
    action: str | None = None           # analyze | chart | anomaly | forecast | sql | pandas | report | null

class ChatResponse(BaseModel):
    conversation_id: str
    message: ChatMessage

class Report(BaseModel):
    id: str
    name: str
    created_at: str
    dataset_id: str | None = None
    dataset_name: str | None = None
    url: str | None = None
    preview_url: str | None = None
    docx_url: str | None = None
    drive_url: str | None = None
```

### Auth Models
```python
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: str | None = None
```

---

## 4. Storage Layer (`app/storage.py`)

File-based persistence (swappable for Postgres later without touching routers).

```python
class Store:
    def __init__(self):
        self.meta_path = settings.meta_path
        self._data = { "datasets": {}, "reports": {}, "history": [], 
                      "automation_runs": [], "settings": {...} }
        self._dataframes: dict[str, pd.DataFrame] = {}
        self._conversations: dict[str, list[dict]] = {}
        self._load()

    # Datasets
    def add_dataset(self, df, name, dtype, extra) -> dict
    def get_dataset(self, ds_id) -> dict | None
    def get_df(self, ds_id) -> pd.DataFrame | None
    def list_datasets(self) -> list[dict]
    def delete_dataset(self, ds_id) -> None
    def combined_df(self, ds_ids) -> pd.DataFrame  # Auto-join on shared columns or concat

    # Conversations (bounded to last 20 turns)
    def get_conversation(self, conv_id) -> list[dict]
    def append_conversation(self, conv_id, role, content) -> None

    # Reports / History / Automation
    def add_report(self, record) -> dict
    def list_reports(self) -> list[dict]
    def delete_report(self, report_id) -> None
    def add_history(self, record) -> None
    def list_history(self) -> list[dict]
    def add_run(self, record) -> dict
    def list_runs(self) -> list[dict]

    # Settings
    def get_settings(self) -> dict
    def update_settings(self, patch) -> dict
```

---

## 5. Dataset Service (`app/services/dataset_service.py`)

### `ingest_file(file: UploadFile) -> dict`
1. **Validate** extension: CSV, TSV, Excel, PNG/JPG/JPEG/WebP/GIF/BMP
2. **Read**:
   - CSV/TSV → `pd.read_csv`
   - Excel → `pd.read_excel`
   - Image → `groq_client.vision_extract_table_csv()` → `pd.read_csv(StringIO)`
3. **Clean**: strip column whitespace, drop empty rows/cols, coerce currency/formatted numbers to numeric
4. **Quality Score** (0–100): completeness × 0.8 + (1 - duplicate_ratio) × 0.2
5. **Join Key Detection**: columns ending in `_id`, named `id`, containing `code`/`key`, or fully unique + non-null
6. **Persist**: save CSV to `data/datasets/ds_{uuid}.csv`, metadata to `meta.json`
7. **Return** `Dataset` model

### `preview(ds_id, page, page_size) -> dict`
Paginated rows + column metadata (dtype, unique count, missing count, is_primary_key).

### `resolve_dataset_ids(dataset_id: str) -> list[str]`
Handles `"all"`, comma-separated IDs, or single ID.

### `get_context_df(dataset_id) -> (pd.DataFrame, list[dict])`
Loads and combines multiple datasets via `store.combined_df()` (auto-join or concat).

---

## 6. Analysis Service (`app/services/analysis.py`)

### Chart Generation (`build_chart_spec`)
LLM selects columns, aggregation, chart type from schema + prompt → returns `ChartSpec` with data.

### Anomaly Detection (`detect_anomalies`)
Z-score (>3) + IQR (1.5×) on all numeric columns → flagged rows with reasons.

### Forecasting (`forecast` + `forecast_auto`)
Advanced pipeline in `forecast_service.py`:
1. LLM parses query → target feature, horizon, filters, aggregation, date column
2. Apply filters → prepare time series (aggregate by date)
3. Prophet (with seasonality) or linear trend fallback
4. Return `ChartSpec` with historical + forecast + confidence intervals

### SQL Generation + Execution (`generate_sql`, `run_sql`)
LLM writes DuckDB SQL against table `df` → executed in-memory via DuckDB → returns DataFrame.

### Pandas Code Generation + Sandbox (`generate_pandas_code`, `run_pandas_code`)
LLM writes pandas expression on `df` → executed in restricted environment:
- Allowed: `len, range, sum, min, max, sorted, round, abs, list, dict, enumerate, zip, str, int, float, bool, True, False, None`
- Blocked: `import, open, exec, eval, __import__, os, sys, subprocess, requests, urllib, socket, globals, locals, input`
- Timeout: 30s via ThreadPoolExecutor

### Dashboard (`build_dashboard`)
Auto-detects KPIs (total/avg per numeric col, row/col count) + 4 charts (bar, line, scatter, pie) cycling through feature pairs. Returns `DashboardResponse` with filters (date range, categorical values).

---

## 7. Chat Service (`app/services/chat_service.py`)

### Agent Loop (`handle_chat`)
```python
async def handle_chat(message, dataset_id, conversation_id, action) -> dict:
    # 1. Resolve dataset(s) → combined DataFrame
    # 2. Load conversation history
    # 3. Classify intent (LLM or explicit action):
    #    "chat" | "chart" | "anomaly" | "forecast" | "sql" | "pandas" | "report" | "analyze"
    # 4. Route to tool, build ExecutionStep trace
    # 5. Compose response via narrator LLM (structured format)
    # 6. Save to conversation history + global history
    # 7. Return { conversation_id, message: ChatMessage }
```

### Intent Classification Prompt
```
Classify into exactly one: analyze | chart | anomaly | forecast | sql | pandas | report | chat
- chart: explicit visualize/plot
- anomaly: outliers/unusual values
- forecast: predict/future/trend
- sql: write SQL query
- pandas: python/pandas code
- report: generate report/document
- chat: general conversation
```

### Narrator System Prompt (Structured Output)
```
1. 📝 Headline Summary — single bold sentence (max 50 words)
2. 📋 Key Points — bullets starting with • **MetricName**: value and context
3. 📈 Analysis — bullets explaining trends/patterns (bold column names)
4. ⚠️ Anomalies — bullets for outliers/risks (if any)
5. 🔮 Outlook — for forecasts, predicted direction + caveats
6. 💡 Recommendation — optional single actionable bullet

Rules: green dot bullets (• ), emoji headers, bold metrics, markdown tables for comparisons, 100-300 words, no prose paragraphs, cite actual numbers.
```

### Voice (`process_voice`)
`groq_client.transcribe(audio_bytes)` → `handle_chat(transcript)`

---

## 8. Groq Client (`app/groq_client.py`)

### Model Fallback Chain
```python
TEXT_MODELS = [
    settings.groq_text_model,           # primary: llama-3.3-70b-versatile
    settings.groq_fallback_text_model,  # fallback 1: kimi-k2-instruct
    "qwen3-32b",                        # fallback 2: hardcoded
]

async def chat_with_fallback(messages, **kwargs):
    for model in TEXT_MODELS:
        try:
            return await groq.chat.completions.create(model=model, messages=messages, **kwargs)
        except GroqError as e:
            if e.status_code in (429, 500, 503): continue
            raise
    raise RuntimeError("All models exhausted")
```

### Vision (Image → Table)
Prompt: "Extract all tables from this image as CSV. Return ONLY the CSV."

### Whisper (Voice → Text)
`groq.audio.transcriptions.create(model=whisper-large-v3-turbo, file=audio.webm, response_format="text")`

---

## 9. Routers (API Endpoints)

### `auth.py`
| Method | Path | Service Call |
|--------|------|--------------|
| POST | `/auth/signup` | `auth_service.register_user()` |
| POST | `/auth/signin` | `auth_service.authenticate_user()` |
| GET | `/auth/me` | `get_current_user` (JWT dependency) |
| POST | `/auth/signout` | Client-side token removal |

### `datasets.py`
| Method | Path | Service Call |
|--------|------|--------------|
| POST | `/upload` | `dataset_service.ingest_file()` |
| GET | `/datasets` | `store.list_datasets()` |
| GET | `/datasets/{id}` | `store.get_dataset()` |
| GET | `/datasets/{id}/preview` | `dataset_service.preview()` |
| DELETE | `/datasets/{id}` | `store.delete_dataset()` |

### `chat.py`
| Method | Path | Service Call |
|--------|------|--------------|
| POST | `/chat` | `chat_service.handle_chat()` |
| POST | `/voice` | `chat_service.process_voice()` |

### `analysis_router.py`
| Method | Path | Service Call |
|--------|------|--------------|
| POST | `/generate-chart` | `analysis.build_chart_spec()` |
| POST | `/detect-anomaly` | `analysis.detect_anomalies()` |
| POST | `/forecast` | `analysis.forecast()` |
| POST | `/generate-sql` | `analysis.generate_sql()` + `run_sql()` |
| POST | `/generate-pandas` | `analysis.generate_pandas_code()` + `run_pandas_code()` |
| POST | `/generate-report` | `report_service.generate_report()` |

### `dashboard.py`
| Method | Path | Service Call |
|--------|------|--------------|
| GET | `/dashboard` | `analysis.build_dashboard()` |

### `reports.py`
| Method | Path | Service Call |
|--------|------|--------------|
| GET | `/reports` | `store.list_reports()` |
| DELETE | `/reports/{id}` | `store.delete_report()` |

### `history.py`
| Method | Path | Service Call |
|--------|------|--------------|
| GET | `/history` | `store.list_history()` |

### `settings_router.py`
| Method | Path | Service Call |
|--------|------|--------------|
| GET | `/settings` | `store.get_settings()` |
| PUT | `/settings` | `store.update_settings()` |

---

## 10. Report Service (`app/services/report_service.py`)

```python
def generate_report(dataset_id: str, prompt: str | None) -> dict:
    df, records = dataset_service.get_context_df(dataset_id)
    # 1. End-to-end analysis via LLM (structured sections)
    insights = _insights_text(df, dataset_name, prompt)
    parsed = _parse_insights(insights)  # Executive Summary, Key Metrics, Insights, Anomalies, Recommendations

    # 2. Generate 2 charts (bar + line) with heuristic insights (no extra LLM calls)
    charts = _select_and_build_charts(df)

    # 3. Build PDF (ReportLab) + DOCX (python-docx)
    #    - Title, Dataset Overview, Key Metrics, Insights, Visual Analysis (2 charts + 3 bullets each), Recommendations
    #    - Charts rendered via matplotlib → embedded as images

    # 4. Save files to data/reports/
    # 5. Optional: Upload PDF to Google Drive
    # 6. Store report metadata, add to history
    # 7. Return report record with urls
```

### Chart Rendering (`_render_chart_image`)
Matplotlib rendering for bar, pie, line, histogram, scatter, with colorblind-friendly palette matching frontend.

---

## 11. Auth Service (`app/services/auth_service.py`)

```python
class AuthService:
    def __init__(self):
        self.client = MongoClient(settings.mongodb_url)
        self.db = self.client[settings.mongodb_db_name]
        self.users = self.db[settings.mongodb_users_collection]
        self._ensure_indexes()  # unique index on email

    def _hash_password(self, password: str) -> str:  # bcrypt
    def _verify_password(self, plain: str, hashed: str) -> bool:  # bcrypt.checkpw

    def create_access_token(self, data: dict, expires_delta: timedelta | None = None) -> str:
        # JWT HS256 with 7-day default expiry

    def decode_token(self, token: str) -> TokenData | None:
        # JWT decode → TokenData(email)

    def register_user(self, user_data: UserCreate) -> UserResponse:
        # Check email unique → hash password → insert → return UserResponse

    def authenticate_user(self, login_data: UserLogin) -> UserResponse:
        # Find user → verify password → return UserResponse

    def get_user_by_email(self, email: str) -> UserResponse | None
    def get_user_by_id(self, user_id: str) -> UserResponse | None
```

### Router Dependency (`app/routers/auth.py`)
```python
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserResponse:
    token_data = auth_service.decode_token(credentials.credentials)
    user = auth_service.get_user_by_email(token_data.email)
    if not user: raise HTTPException(401, "User not found")
    return user
```

---

## 12. Multi-Dataset Handling (Joins)

```python
def combined_df(self, ds_ids: list[str]) -> pd.DataFrame:
    dfs = [self._dataframes[i] for i in ds_ids if i in self._dataframes]
    if not dfs: return pd.DataFrame()
    if len(dfs) == 1: return dfs[0]
    result = dfs[0]
    for other in dfs[1:]:
        shared = list(set(result.columns) & set(other.columns))
        key_cols = [c for c in shared if result[c].nunique() > 1 or other[c].nunique() > 1]
        if key_cols:
            try:
                result = result.merge(other, on=key_cols, how="outer", suffixes=("", "_2"))
                continue
            except Exception:
                pass
        result = pd.concat([result, other], ignore_index=True, sort=False)
    return result
```

---

## 13. Sandboxed Pandas Execution

```python
_FORBIDDEN = re.compile(r"\b(import|open|exec|eval|__|os\.|sys\.|subprocess|globals|locals|input)\b")

def run_pandas_code(df: pd.DataFrame, code: str) -> Any:
    if _FORBIDDEN.search(code):
        raise ValueError("Generated code contains disallowed operations.")
    local_ns = {"df": df.copy(), "pd": pd, "np": np}
    try:
        compiled = compile(code, "<pandas_code>", "eval")
        return eval(compiled, {"__builtins__": _ALLOWED_BUILTINS}, local_ns)
    except SyntaxError:
        exec(compile(code, "<pandas_code>", "exec"), {"__builtins__": _ALLOWED_BUILTINS}, local_ns)
        return local_ns.get("result")
```

---

## 14. Running the Backend

### Development
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env → add GROQ_API_KEY, MONGODB_URL, JWT_SECRET_KEY, CORS_ORIGINS
uvicorn app.main:app --reload --port 8000
```

### Production
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
# Or: gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

### Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV PYTHONUNBUFFERED=1
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 15. API Documentation

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

All endpoints match `frontend/src/lib/api/endpoints.ts` 1:1.

---

## 16. Extending the Backend

| Want to add... | Where to add |
|----------------|--------------|
| New analysis type (clustering) | `analysis.py` + `analysis_router.py` + `models.py` + `endpoints.ts` |
| New data source (SQL, S3, API) | `dataset_service.py` → new `ingest_*` function |
| Real database | Replace `storage.py` with SQLAlchemy models |
| Auth (JWT, OAuth) | Already implemented; add `Depends(get_current_user)` to routers |
| Background jobs (Celery, RQ) | Move long-running tasks (report gen, forecast) to workers |
| WebSocket streaming chat | Add `/chat/stream` WebSocket endpoint in `chat.py` |

---

## 17. Key Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Contract-first** | Pydantic models = TypeScript types; routers mirror `endpoints.ts` |
| **Swappable storage** | `storage.py` is only persistence layer; routers don't know about files |
| **LLM as orchestrator** | Chat agent classifies intent → calls deterministic Python (SQL, pandas, stats) |
| **Sandboxed execution** | Regex guard + restricted globals + 30s timeout (guardrail, not security boundary) |
| **Model fallback chain** | Auto-retry on 429/500/503 across 3 Groq models |
| **Multi-dataset joins** | Auto-detect join keys; fallback to concat |
| **Observability** | Execution trace in every chat response (steps, durations, inputs/outputs) |

---

## 18. Troubleshooting

| Issue | Fix |
|-------|-----|
| `GROQ_API_KEY` not set | Check `.env` exists with valid key |
| CORS error | Add frontend origin to `CORS_ORIGINS` in `.env` |
| Upload fails (413) | Increase `MAX_UPLOAD_MB` or nginx `client_max_body_size` |
| Pandas timeout | Increase `PANDAS_TIMEOUT_SECONDS` or optimize code |
| DuckDB join fails | Check column names/dtypes match; falls back to concat |
| PDF generation fails | `pip install kaleido` for Plotly static export |
| MongoDB connection failed | Check `MONGODB_URL` in `.env`; ensure MongoDB running |
| JWT errors | Verify `JWT_SECRET_KEY` in `.env` (min 32 chars) |
| Prophet not installed | `pip install prophet` (needs C++ build tools on Windows) |

---

## 19. Useful Commands

```bash
# Run tests (if added)
pytest

# Type check
mypy app/

# Lint
ruff check app/

# Format
ruff format app/

# Check Groq models available
curl -H "Authorization: Bearer $GROQ_API_KEY" https://api.groq.com/openai/v1/models
```

---

## 20. Related Docs

- [Frontend Process Documentation](./PROCESS_OF_FRONTEND.md)
- [Backend README](./backend/README.md)
- [Project Summary](./PROJECT_SUMMARY.md)