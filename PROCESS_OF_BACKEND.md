# Insight Engine — Backend Process Documentation

> **Tech Stack:** Python 3.11+ • FastAPI • Pydantic v2 • Groq (LLM, Vision, Whisper) • DuckDB • Pandas • Prophet • ReportLab • python-docx • MongoDB (Auth) • Uvicorn

---

## 1. Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app, CORS, routers, static files, health
│   ├── core/                   # Core configuration & database
│   │   ├── __init__.py
│   │   ├── config.py           # Pydantic Settings (.env)
│   │   └── database.py         # MongoDB connection + indexes
│   ├── models/                 # Pydantic models (shared with frontend types.ts)
│   │   ├── __init__.py
│   │   └── models.py
│   ├── storage/                # File-based persistence (swappable)
│   │   ├── __init__.py
│   │   └── storage.py          # Store class: datasets, reports, history, runs, settings, Google tokens
│   ├── domains/                # Domain-driven modules (feature folders)
│   │   ├── __init__.py
│   │   ├── analysis/           # Charts, anomalies, forecasting, SQL, pandas, dashboards
│   │   │   ├── __init__.py
│   │   │   ├── analysis.py     # Core analysis logic
│   │   │   └── routers.py      # /generate-chart, /detect-anomaly, /forecast, /generate-sql, /generate-pandas, /generate-report
│   │   ├── anomalies/          # Dedicated anomaly detection (if separate)
│   │   │   ├── __init__.py
│   │   │   └── service.py
│   │   ├── auth/               # JWT authentication (HS256, bcrypt)
│   │   │   ├── __init__.py
│   │   │   ├── service.py      # AuthService: register, login, tokens, users
│   │   │   └── routers.py      # /auth/signup, /auth/signin, /auth/me, /auth/signout
│   │   ├── automation/         # Workflow integrations (Gmail, Telegram, Calendar)
│   │   │   ├── __init__.py
│   │   │   ├── automation.py   # Service definitions + stubs
│   │   │   └── routers.py      # GET/POST /automation (checks Telegram connection)
│   │   ├── chat/               # Conversational agent (intent routing, narrator)
│   │   │   ├── __init__.py
│   │   │   ├── service.py      # ChatService: handle_chat, process_voice
│   │   │   └── routers.py      # POST /chat, POST /voice
│   │   ├── dashboard/          # Auto-generated BI dashboards
│   │   │   ├── __init__.py
│   │   │   └── router.py       # GET /dashboard
│   │   ├── datasets/           # File upload, validation, cleaning, preview
│   │   │   ├── __init__.py
│   │   │   ├── service.py      # DatasetService: ingest, preview, resolve IDs, context DF
│   │   │   └── routers.py      # POST /upload, GET /datasets, /datasets/{id}, /preview, DELETE
│   │   ├── forecasting/        # Advanced forecasting pipeline (Prophet + fallback)
│   │   │   ├── __init__.py
│   │   │   └── service.py
│   │   ├── history/            # Unified activity timeline
│   │   │   ├── __init__.py
│   │   │   └── routers.py      # GET /history
│   │   ├── reports/            # PDF/DOCX generation, Telegram send
│   │   │   ├── __init__.py
│   │   │   ├── service.py      # ReportService: generate_report, _render_chart_image
│   │   │   └── routers.py      # GET /reports, DELETE /reports/{id}, POST /reports/{id}/send-telegram
│   │   └── settings/           # App settings persistence
│   │       ├── __init__.py
│   │       └── routers.py      # GET/PUT /settings
│   └── integrations/           # External service integrations
│       ├── __init__.py
│       ├── telegram/           # Telegram Bot API wrapper
│       │   ├── __init__.py
│       │   └── service.py      # TelegramService: send_message, test_connection
│       └── google_drive/       # Google Drive API (stub)
│           ├── __init__.py
│           └── service.py
├── data/                       # Persistent storage (gitignored)
│   ├── datasets/               # CSV files (ds_{id}.csv)
│   ├── reports/                # Generated PDF/DOCX reports
│   ├── meta.json               # Dataset metadata, history, settings, automation runs, Google tokens
│   └── history.json            # (legacy) Chat/analysis history log
├── requirements.txt
├── .env.example
├── .env                        # (gitignored) — GROQ_API_KEY, MongoDB, JWT, CORS, Telegram
├── README.md
└── viewduckdb.py               # Debug script
```

---

## 2. Configuration (`app/core/config.py`)

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

    # Telegram (for automation + report delivery)
    telegram_bot_token: str = ""
    telegram_chat_id: str = ""

    # Computed properties
    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def datasets_dir(self) -> Path:
        p = Path(self.data_dir) / "datasets"
        p.mkdir(parents=True, exist_ok=True)
        return p

    @property
    def reports_dir(self) -> Path:
        p = Path(self.data_dir) / "reports"
        p.mkdir(parents=True, exist_ok=True)
        return p

    @property
    def meta_path(self) -> Path:
        return Path(self.data_dir) / "meta.json"

settings = Settings()
```

---

## 3. Data Models (`app/models/models.py`)

All Pydantic models mirror `frontend/src/lib/api/types.ts` exactly.

### Core Models
```python
class ColumnMeta(BaseModel):
    name: str
    dtype: str
    unique: Optional[int] = None
    missing: Optional[int] = None
    is_primary_key: Optional[bool] = None
    is_foreign_key: Optional[bool] = None

class Dataset(BaseModel):
    id: str                          # ds_{uuid}
    name: str
    type: str                        # "csv" | "pdf" | "docx" | "image"
    rows: int
    columns: int
    size_bytes: int
    quality_score: Optional[float] = None
    uploaded_at: str
    status: Optional[str] = "ready"
    detected_tables: Optional[int] = None
    detected_text: Optional[int] = None
    missing_values: Optional[int] = None
    possible_join_keys: Optional[list[str]] = None

class DatasetPreview(BaseModel):
    columns: list[ColumnMeta]
    rows: list[dict[str, Any]]
    total_rows: int
    page: int
    page_size: int

class UploadResponse(BaseModel):
    dataset: Dataset
```

### Analysis Models
```python
ChartType = Literal[
    "bar", "line", "pie", "scatter", "heatmap", "histogram",
    "treemap", "box", "area", "radar", "bubble", "waterfall", "sunburst"
]

class ChartSpec(BaseModel):
    id: str
    title: str
    type: str
    description: Optional[str] = None
    x_key: Optional[str] = None
    y_keys: Optional[list[str]] = None
    data: list[dict[str, Any]]
    meta: Optional[dict[str, Any]] = None

class KPI(BaseModel):
    id: str
    label: str
    value: Any
    delta: Optional[float] = None
    format: Optional[str] = "number"

class DashboardResponse(BaseModel):
    kpis: list[KPI]
    charts: list[ChartSpec]
    filters: Optional[dict[str, Any]] = None
```

### Chat Models
```python
class ChatBlock(BaseModel):
    type: str
    text: Optional[str] = None
    markdown: Optional[str] = None
    columns: Optional[list[str]] = None
    rows: Optional[list[dict[str, Any]]] = None
    chart: Optional[ChartSpec] = None
    language: Optional[str] = None
    code: Optional[str] = None
    url: Optional[str] = None
    alt: Optional[str] = None
    name: Optional[str] = None
    status: Optional[str] = None

class ExecutionStep(BaseModel):
    id: str
    label: str
    status: str              # pending | running | completed | failed
    detail: Optional[str] = None

class ChatMessage(BaseModel):
    id: str
    role: str                # user | assistant | system
    created_at: str
    blocks: list[ChatBlock]
    execution: Optional[list[ExecutionStep]] = None

class ChatRequest(BaseModel):
    message: str
    dataset_id: Optional[str] = None       # "ds_1" | "ds_1,ds_2" | "all"
    conversation_id: Optional[str] = None
    action: Optional[str] = None            # analyze | chart | anomaly | forecast | sql | pandas | report | null

class ChatResponse(BaseModel):
    conversation_id: str
    message: ChatMessage
```

### Report Models
```python
class Report(BaseModel):
    id: str
    name: str
    created_at: str
    dataset_id: Optional[str] = None
    dataset_name: Optional[str] = None
    url: Optional[str] = None
    preview_url: Optional[str] = None
    docx_url: Optional[str] = None
    drive_url: Optional[str] = None
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
    email: Optional[str] = None
```

---

## 4. Storage Layer (`app/storage/storage.py`)

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
    def get_report(self, report_id) -> Optional[dict]
    def add_history(self, record) -> None
    def list_history(self) -> list[dict]
    def add_run(self, record) -> dict
    def list_runs(self) -> list[dict]

    # Settings
    def get_settings(self) -> dict
    def update_settings(self, patch) -> dict

    # Google OAuth tokens (per user)
    def get_google_tokens(self, user_id: str) -> Optional[dict]
    def save_google_tokens(self, user_id: str, tokens: dict) -> None
    def update_google_tokens(self, user_id: str, tokens: dict) -> None
    def delete_google_tokens(self, user_id: str) -> None

store = Store()
```

---

## 5. Dataset Service (`app/domains/datasets/service.py`)

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

## 6. Analysis Service (`app/domains/analysis/analysis.py`)

### Chart Generation (`build_chart_spec`)
LLM selects columns, aggregation, chart type from schema + prompt → returns `ChartSpec` with data.

### Anomaly Detection (`detect_anomalies`)
Z-score (>3) + IQR (1.5×) on all numeric columns → flagged rows with reasons.

### Forecasting (`forecast` + `forecast_auto`)
Advanced pipeline in `forecasting/service.py`:
1. LLM parses query → target feature, horizon, filters, aggregation, date column
2. Apply filters → prepare time series (aggregate by date)
3. Prophet (with seasonality) or linear trend fallback
4. Return `ChartSpec` with historical + forecast + confidence intervals

### SQL Generation + Execution (`generate_sql`, `run_sql`)
LLM writes DuckDB SQL against table `df` → executed in-memory via DuckDB → returns DataFrame.

### Pandas Code Generation + Sandbox (`generate_pandas_code`, `run_pandas_code`)
LLM writes pandas expression on `df` → executed in restricted environment:
- **Allowed**: `len, range, sum, min, max, sorted, round, abs, list, dict, enumerate, zip, str, int, float, bool, True, False, None`
- **Blocked**: `import, open, exec, eval, __import__, os, sys, subprocess, requests, urllib, socket, globals, locals, input`
- **Timeout**: 30s via ThreadPoolExecutor

### Dashboard (`build_dashboard`)
Auto-detects KPIs (total/avg per numeric col, row/col count) + 4 charts (bar, line, scatter, pie) cycling through feature pairs. Returns `DashboardResponse` with filters (date range, categorical values).

---

## 7. Chat Service (`app/domains/chat/service.py`)

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

## 8. Groq Client (`app/integrations/groq/client.py`)

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

### `auth.py` (`/auth`)
| Method | Path | Service Call |
|--------|------|--------------|
| POST | `/auth/signup` | `auth_service.register_user()` |
| POST | `/auth/signin` | `auth_service.authenticate_user()` |
| GET | `/auth/me` | `get_current_user` (JWT dependency) |
| POST | `/auth/signout` | Client-side token removal |

### `datasets.py` (`/datasets`, `/upload`)
| Method | Path | Service Call |
|--------|------|--------------|
| POST | `/upload` | `dataset_service.ingest_file()` |
| GET | `/datasets` | `store.list_datasets()` |
| GET | `/datasets/{id}` | `store.get_dataset()` |
| GET | `/datasets/{id}/preview` | `dataset_service.preview()` |
| DELETE | `/datasets/{id}` | `store.delete_dataset()` |

### `chat.py` (`/chat`, `/voice`)
| Method | Path | Service Call |
|--------|------|--------------|
| POST | `/chat` | `chat_service.handle_chat()` |
| POST | `/voice` | `chat_service.process_voice()` |

### `analysis_router.py` (Analysis primitives)
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
| POST | `/reports/{id}/send-telegram` | `telegram_service.send_document()` |

### `history.py`
| Method | Path | Service Call |
|--------|------|--------------|
| GET | `/history` | `store.list_history()` |

### `settings_router.py`
| Method | Path | Service Call |
|--------|------|--------------|
| GET | `/settings` | `store.get_settings()` |
| PUT | `/settings` | `store.update_settings()` |

### `automation.py` (`/automation`)
| Method | Path | Service Call |
|--------|------|--------------|
| GET | `/automation` | Returns services (Gmail, Telegram, Calendar) + runs |
| POST | `/automation` | Triggers automation (Telegram test implemented, others stubbed) |

---

## 10. Report Service (`app/domains/reports/service.py`)

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

## 11. Auth Service (`app/domains/auth/service.py`)

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

### Router Dependency (`app/domains/auth/routers.py`)
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
# Edit .env → add GROQ_API_KEY, MONGODB_URL, JWT_SECRET_KEY, CORS_ORIGINS, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
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
| New analysis type (clustering) | `analysis/analysis.py` + `analysis/routers.py` + `models.py` + `endpoints.ts` |
| New data source (SQL, S3, API) | `datasets/service.py` → new `ingest_*` function |
| Real database | Replace `storage.py` with SQLAlchemy models |
| Auth (JWT, OAuth) | Already implemented; add `Depends(get_current_user)` to routers |
| Background jobs (Celery, RQ) | Move long-running tasks (report gen, forecast) to workers |
| WebSocket streaming chat | Add `/chat/stream` WebSocket endpoint in `chat/routers.py` |
| Google Drive upload | Implement `integrations/google_drive/service.py` |

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
| **Domain-driven** | Each feature in `app/domains/{feature}/` with own service + routers |

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
| Telegram bot not working | Check `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `.env` |

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