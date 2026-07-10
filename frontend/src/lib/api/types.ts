// Shared types for FastAPI + LangGraph backend.

export interface Dataset {
  id: string;
  name: string;
  type: "csv" | "pdf" | "docx" | "image" | string;
  rows: number;
  columns: number;
  size_bytes: number;
  quality_score?: number;
  uploaded_at: string;
  status?: "ready" | "processing" | "failed";
  detected_tables?: number;
  detected_text?: number;
  missing_values?: number;
  possible_join_keys?: string[];
}

export interface DatasetPreview {
  columns: ColumnMeta[];
  rows: Record<string, unknown>[];
  total_rows: number;
  page: number;
  page_size: number;
}

export interface ColumnMeta {
  name: string;
  dtype: string;
  unique?: number;
  missing?: number;
  is_primary_key?: boolean;
  is_foreign_key?: boolean;
}

export interface UploadResponse {
  dataset: Dataset;
}

export type ChartType =
  | "bar"
  | "line"
  | "pie"
  | "scatter"
  | "heatmap"
  | "histogram"
  | "treemap"
  | "box"
  | "area"
  | "radar"
  | "bubble"
  | "waterfall"
  | "sunburst";

export interface ChartSpec {
  id: string;
  title: string;
  type: ChartType;
  description?: string;
  x_key?: string;
  y_keys?: string[];
  data: Array<Record<string, string | number>>;
  meta?: Record<string, unknown>;
}

export interface KPI {
  id: string;
  label: string;
  value: number | string;
  delta?: number;
  format?: "number" | "currency" | "percent";
}

export interface DashboardResponse {
  kpis: KPI[];
  charts: ChartSpec[];
  filters?: {
    date?: { min: string; max: string };
    regions?: string[];
    categories?: string[];
    customers?: string[];
  };
}

export type ChatBlock =
  | { type: "text"; text: string }
  | { type: "markdown"; markdown: string }
  | { type: "table"; columns: string[]; rows: Array<Record<string, unknown>> }
  | { type: "chart"; chart: ChartSpec }
  | { type: "code"; language: string; code: string }
  | { type: "image"; url: string; alt?: string }
  | { type: "pdf"; url: string; name: string }
  | { type: "status"; status: string }
  | { type: "reasoning"; text: string };

export interface ExecutionStep {
  id: string;
  label: string;
  status: "pending" | "running" | "completed" | "failed";
  detail?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  created_at: string;
  blocks: ChatBlock[];
  execution?: ExecutionStep[];
}

export interface ChatRequest {
  message: string;
  dataset_id?: string;
  conversation_id?: string;
  action?:
    | "analyze"
    | "chart"
    | "anomaly"
    | "forecast"
    | "sql"
    | "pandas"
    | "report"
    | null;
}

export interface ChatResponse {
  conversation_id: string;
  message: ChatMessage;
}

export interface Report {
  id: string;
  name: string;
  created_at: string;
  dataset_id?: string;
  dataset_name?: string;
  url?: string;
  preview_url?: string;
  docx_url?: string;
  drive_url?: string;
}

export interface HistoryItem {
  id: string;
  kind: "conversation" | "analysis" | "chart" | "report" | "export";
  title: string;
  created_at: string;
  meta?: Record<string, unknown>;
}

export interface AutomationService {
  id: string;
  name: "gmail" | "telegram" | "google_drive" | string;
  label: string;
  connected: boolean;
  last_run?: string;
}

export interface WorkflowRun {
  id: string;
  service: string;
  status: "success" | "failed" | "running";
  created_at: string;
  message?: string;
}

export interface AppSettings {
  groq_model: string;
  temperature: number;
  language: string;
  theme: "light" | "dark" | "system";
  automation_enabled: boolean;
  voice_enabled: boolean;
  notifications_enabled: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}
