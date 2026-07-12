# Insight Engine — Frontend Process Documentation (processofrontend.md)

> **Tech Stack:** React 19 + TanStack Router + TanStack Query + TanStack Start (Vite/SSR) + TailwindCSS 4 + Radix UI + TypeScript

---

## 1. Project Structure

```
frontend/
├── public/                 # Static assets (favicon, robots.txt)
├── src/
│   ├── components/
│   │   ├── app/           # App-level composite components (Sidebar, Navbar, KPI cards, etc.)
│   │   ├── chat/          # Chat-specific components (ChatInput, ExecutionTimeline)
│   │   ├── ui/            # Atomic UI primitives (Button, Card, Dialog, etc. — Radix-based)
│   │   └── auth/          # Authentication components (AuthModal, AuthPage)
│   ├── context/           # React Context providers (AuthContext)
│   ├── hooks/             # Custom React hooks (use-theme, use-mobile)
│   ├── lib/
│   │   ├── api/           # API layer (client, endpoints, types)
│   │   ├── error-*.ts     # Error handling utilities
│   │   └── utils.ts       # Shared utilities (cn, formatters, etc.)
│   ├── routes/            # File-based routes (TanStack Router)
│   │   ├── index.tsx      # Home / Dashboard landing page
│   │   ├── chat.tsx       # AI Chat page
│   │   ├── datasets.tsx   # Dataset list / management
│   │   ├── datasets.upload.tsx   # Upload page
│   │   ├── datasets.$id.tsx      # Dataset detail / preview
│   │   ├── dashboard.tsx  # Auto-generated BI dashboard
│   │   ├── reports.tsx    # Report list / generation
│   │   ├── history.tsx    # Chat history
│   │   ├── settings.tsx   # Settings page
│   │   ├── automation.tsx # Automation / workflow runner
│   │   └── __root.tsx     # Root layout (providers, sidebar, navbar, auth gate)
│   ├── routeTree.gen.ts   # Auto-generated route tree
│   ├── router.tsx         # Router instance & query client provider
│   ├── server.ts          # TanStack Start server entry (SSR)
│   ├── start.tsx          # Client entry (hydration)
│   ├── styles.css         # Tailwind + global styles
│   └── router.tsx         # Router config
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts     (if present — otherwise Tailwind v4 via CSS)
└── components.json        # shadcn/ui config
```

---

## 2. Routing & Navigation (TanStack Router)

| Route | Path | Purpose |
|-------|------|---------|
| `__root` | `/` (layout) | Root layout — providers, sidebar, top navbar |
| `index` | `/` | Home / landing — quick actions, recent datasets, recent reports |
| `chat` | `/chat` | AI chat interface (natural language Q&A) |
| `datasets` | `/datasets` | Dataset listing + upload button |
| `datasets.upload` | `/datasets/upload` | File upload page (CSV, Excel, images of tables) |
| `datasets.$id` | `/datasets/$id` | Dataset detail — preview, schema, quality score |
| `dashboard` | `/dashboard` | Auto-generated BI dashboard (KPIs + charts) |
| `reports` | `/reports` | List & generate PDF reports |
| `history` | `/history` | Chat / analysis history |
| `settings` | `/settings` | App settings (API keys, theme, etc.) |
| `automation` | `/automation` | Automation / workflow runner |

### Navigation Components
- **AppSidebar** (`src/components/app/AppSidebar.tsx`) — collapsible left nav with icons + labels
- **TopNavbar** (`src/components/app/TopNavbar.tsx`) — top bar with theme toggle, user menu, notifications
- **PageHeader** (`src/components/app/PageHeader.tsx`) — consistent page title + description + action slot

### Authentication Flow
- **AuthProvider** (`src/context/AuthContext.tsx`) — React context managing user session, JWT tokens, login/signup/logout
- **AuthGate** (in `__root.tsx`) — Conditional rendering: loading → full-page auth screen → authenticated app
- **AuthModal** (`src/components/auth/AuthModal.tsx`) — Full-page Sign In / Sign Up form with tabs, validation, error handling
- **AuthPage** (`src/components/auth/AuthPage.tsx`) — Wrapper for the full-page auth experience
- **Flow**: On app load → check token in localStorage → if valid, fetch `/auth/me` → show app; if invalid/missing → show full-page auth screen → on success, navigate to `/`

---

## 3. State Management & Data Fetching (TanStack Query)

All server state lives in **TanStack Query (v5)**. No Redux / Zustand / Context for server state.

### Query Client Setup (`src/router.tsx`)
```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});
```

### Key Query Keys
| Feature | Query Key | Invalidation Triggers |
|---------|-----------|----------------------|
| Datasets | `["datasets"]` | After upload, delete |
| Dataset detail | `["datasets", id]` | On preview, delete |
| Reports | `["reports"]` | After generate, delete |
| History | `["history"]` | After chat, analysis |
| Dashboard | `["dashboard", params]` | On dataset change, param change |
| Settings | `["settings"]` | On settings save |

### API Layer (`src/lib/api/`)
| File | Purpose |
|------|---------|
| `client.ts` | Axios instance with baseURL, interceptors (auth, error handling) |
| `endpoints.ts` | Typed API functions (listDatasets, upload, chat, generateChart, etc.) |
| `types.ts` | TypeScript interfaces mirroring backend Pydantic models |

**Example:** `endpoints.upload(file, onProgress)` → `POST /upload` with `FormData` + progress callback.

---

## 4. UI Component System

### Design System
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Radix UI primitives** (headless, accessible) wrapped in `src/components/ui/*`
- **shadcn/ui** patterns via `components.json` (class-variance-authority + tailwind-merge)
- **Lucide React** icons

### Key App Components (`src/components/app/`)
| Component | Description |
|-----------|-------------|
| `AppSidebar` | Collapsible nav with icon + label, active route highlight |
| `TopNavbar` | Theme toggle, user avatar, notifications, breadcrumb |
| `PageHeader` | Title, description, action slot (e.g. "New Chat" button) |
| `KpiCard` | KPI metric card with trend indicator |
| `StatusPill` | Status badge (success, warning, error, pending) |
| `EmptyState` | Empty state illustration + message + CTA |
| `ChartCard` | Wrapper for Plotly / Recharts with description |

### Chat Components (`src/components/chat/`)
| Component | Purpose |
|-----------|---------|
| `ChatInput` | Textarea + send button, voice button, file attach |
| `ExecutionTimeline` | Step-by-step agent execution trace (SQL, pandas, chart, etc.) |

---

## 5. Key Features & Page Flows

### 5.1 Home / Landing (`/`)
- Quick action cards (Upload, Analyze, Dashboard, Report, Chat)
- Recent datasets (list with preview link)
- Recent reports (list with download)
- Suggested prompts for chat

### 5.2 Dataset Upload (`/datasets/upload`)
- Drag-and-drop / file picker
- Accepts: `.csv`, `.xlsx`, `.xls`, `.png`, `.jpg`, `.jpeg` (images of tables)
- Progress bar via `onUploadProgress`
- On success → redirect to `/datasets/$id`

### 5.3 Dataset Detail (`/datasets/$id`)
- Tabs: **Preview** (paginated table), **Schema** (columns, types, null%), **Quality** (score, issues)
- Actions: Download CSV, Delete, "Analyze in Chat", "Generate Dashboard"

### 5.4 AI Chat (`/chat`)
- Conversation history (sidebar or top)
- Streaming responses via `endpoints.chat()` (SSE-like via TanStack Query mutation)
- **ExecutionTimeline** renders each tool call: SQL → result → chart → insight → code
- Voice input button → `endpoints.voice(audioBlob)`
- File attachment → uploads dataset first, then attaches `dataset_id` to chat

### 5.5 Dashboard (`/dashboard`)
- Query param `?dataset_id=ds_1,ds_2` or `?dataset_id=all`
- Fetches `/dashboard` → returns `{ kpis: KPI[], charts: ChartSpec[] }`
- Renders KPI grid (5 cols) + Chart grid (2 cols)
- Each chart = `ChartCard` (Plotly for complex, Recharts for simple)
- Footer shows active dataset info (rows, cols, quality score)

### 5.6 Reports (`/reports`)
- List existing reports (PDF)
- "Generate Report" → calls `/generate-report` with `dataset_id` + optional prompt
- Download / delete actions

### 5.7 History (`/history`)
- Unified timeline of: chat messages, analysis runs, report generations
- Filter by type, date range, dataset

### 5.8 Settings (`/settings`)
- Theme (light/dark/system)
- API base URL (`VITE_API_BASE_URL`)
- Groq API key (if frontend-managed)
- Dataset defaults (default join strategy, preview rows)

### 5.9 Automation (`/automation`)
- List connected services (Google Drive/Gmail, Telegram, Google Calendar)
- **All three services show as "Connected" with green status pills**
- Google Drive shows **Drive icon (Cloud)** and label "Google Drive"
- Telegram shows **Send icon**
- Calendar shows **Calendar icon**
- Trigger workflow runs
- View run history / logs
- Test/Run buttons enabled for connected services
- Status messages:
  - "Google Drive is connected and ready"
  - "Telegram bot is connected and ready"
  - "Google Calendar is connected and ready"

---

## 6. API Contract (Frontend ↔ Backend)

Defined in `src/lib/api/types.ts` — mirrors `backend/app/models/models.py`.

### Core Types
```ts
interface Dataset {
  id: string;
  name: string;
  filename: string;
  rows: number;
  columns: number;
  quality_score: number | null;
  created_at: string;
}

interface ChatRequest {
  message: string;
  conversation_id?: string;
  dataset_id?: string;      // "ds_1" | "ds_1,ds_2" | "all"
  stream?: boolean;
}

interface ChatResponse {
  message: string;
  conversation_id: string;
  execution_trace?: ExecutionStep[];
  chart?: ChartSpec;
  sql?: string;
  pandas_code?: string;
}

interface ChartSpec {
  id: string;
  type: "bar" | "line" | "pie" | "scatter" | "histogram" | "area";
  title: string;
  data: Record<string, unknown>[];
  layout: Record<string, unknown>;
  description?: string;
}

interface DashboardResponse {
  kpis: KPI[];
  charts: ChartSpec[];
}

interface KPI {
  id: string;
  label: string;
  value: string | number;
  trend?: { value: number; label: string };
}
```

### API Endpoints (mirrored in `endpoints.ts`)
| Frontend Call | Backend Route | Method |
|---------------|---------------|--------|
| `listDatasets()` | `/datasets` | GET |
| `upload(file)` | `/upload` | POST (multipart) |
| `previewDataset(id, page, size)` | `/datasets/{id}/preview` | GET |
| `deleteDataset(id)` | `/datasets/{id}` | DELETE |
| `chat(req)` | `/chat` | POST |
| `voice(audio)` | `/voice` | POST (multipart) |
| `generateChart(payload)` | `/generate-chart` | POST |
| `generateReport(payload)` | `/generate-report` | POST |
| `detectAnomaly(payload)` | `/detect-anomaly` | POST |
| `forecast(payload)` | `/forecast` | POST |
| `generateSql(payload)` | `/generate-sql` | POST |
| `getDashboard(params)` | `/dashboard` | GET |
| `listReports()` | `/reports` | GET |
| `deleteReport(id)` | `/reports/{id}` | DELETE |
| `listHistory()` | `/history` | GET |
| `getSettings()` | `/settings` | GET |
| `updateSettings(payload)` | `/settings` | PUT |
| `listAutomation()` | `/automation` | GET |
| `runAutomation(service)` | `/automation` | POST |

---

## 7. Development Workflow

### Install & Run
```bash
cd frontend
bun install           # or npm/yarn/pnpm
bun run dev           # Vite dev server (TanStack Start dev mode)
# or: bun run build && bun run preview  # Production build + preview
```

### Linting & Formatting
```bash
bun run lint          # ESLint
bun run format        # Prettier
```

### Type Checking
```bash
bunx tsc --noEmit     # TypeScript type check
```

### Build for Production
```bash
bun run build         # Outputs to .output/ (TanStack Start)
```

---

## 8. Environment Variables (`frontend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | Yes | `http://localhost:8000` | Backend API base URL |
| `VITE_APP_NAME` | No | `Ada Analyst` | App display name |

---

## 9. Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **TanStack Router (file-based)** | Type-safe routes, nested layouts, loaders, built-in search params parsing |
| **TanStack Query v5** | Server state caching, deduping, retries, devtools — no client-state boilerplate |
| **TanStack Start (Vite + SSR)** | SSR/SSG support, file-based routes, streaming, great DX |
| **Radix + Tailwind (shadcn pattern)** | Accessible, unstyled primitives + utility CSS = fast, consistent UI |
| **Axios + TanStack Query** | Familiar API, interceptors, progress events for uploads |
| **TypeScript strict + Zod (via backend)** | End-to-end type safety; backend Pydantic = frontend types |
| **Plotly.js + Recharts** | Plotly for complex/interactive; Recharts for simple static charts |
| **TanStack Start server entry** | Enables SSR/streaming for SEO-critical pages (landing, dashboard) |

---

## 10. Adding a New Page / Feature

1. **Create route file** in `src/routes/` (e.g., `src/routes/analytics.tsx`)
2. **Add route to sidebar** in `AppSidebar.tsx` (add to `navItems` array)
3. **Define API types** in `src/lib/api/types.ts` (mirror backend Pydantic)
4. **Add endpoint** in `src/lib/api/endpoints.ts`
5. **Build UI** using `components/ui/*` + `components/app/*`
6. **Use TanStack Query** for data fetching (`useQuery`, `useMutation`)
7. **Add route to `routeTree.gen.ts`** (auto-generated on dev server restart)

---

## 11. Common Patterns

### Data Fetching (Query)
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ["datasets"],
  queryFn: endpoints.listDatasets,
});
```

### Mutation (Upload, Chat, Generate)
```tsx
const mutation = useMutation({
  mutationFn: endpoints.upload,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["datasets"] }),
  onError: (err) => toast.error(err.message),
});
```

### Optimistic Update (Delete Dataset)
```tsx
const mutation = useMutation({
  mutationFn: endpoints.deleteDataset,
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ["datasets"] });
    const prev = queryClient.getQueryData<Dataset[]>(["datasets"]);
    queryClient.setQueryData(["datasets"], (old) => old?.filter(d => d.id !== id));
    return { prev };
  },
  onError: (err, id, ctx) => queryClient.setQueryData(["datasets"], ctx?.prev),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ["datasets"] }),
});
```

---

## 12. Deployment Notes

- **Build output:** `.output/` (TanStack Start)
- **Node server:** `.output/server/index.mjs` (runs on any Node host)
- **Static assets:** `.output/public/`
- **Env vars:** Set `VITE_API_BASE_URL` at build time or via runtime env
- **Docker:** Use `node:20-alpine` base, copy `.output/`, run `node .output/server/index.mjs`

---

## 13. Useful Links

- [TanStack Router Docs](https://tanstack.com/router)
- [TanStack Query Docs](https://tanstack.com/query)
- [TanStack Start Docs](https://tanstack.com/start)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Plotly.js React](https://plotly.com/javascript/react/)
- [shadcn/ui](https://ui.shadcn.com/)