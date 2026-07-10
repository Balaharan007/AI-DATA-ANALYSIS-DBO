import { api } from "./client";
import type {
  AppSettings,
  AutomationService,
  AuthResponse,
  ChartSpec,
  ChatRequest,
  ChatResponse,
  DashboardResponse,
  Dataset,
  DatasetPreview,
  HistoryItem,
  Report,
  SigninRequest,
  SignupRequest,
  UploadResponse,
  User,
  WorkflowRun,
} from "./types";

export const endpoints = {
  // Auth
  async signup(payload: SignupRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/signup", payload);
    return data;
  },
  async signin(payload: SigninRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/signin", payload);
    return data;
  },
  async signout(): Promise<void> {
    await api.post("/auth/signout");
  },
  async getMe(): Promise<User> {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },

  // Datasets
  async listDatasets(): Promise<Dataset[]> {
    const { data } = await api.get<Dataset[]>("/datasets");
    return data;
  },
  async getDataset(id: string): Promise<Dataset> {
    const { data } = await api.get<Dataset>(`/datasets/${id}`);
    return data;
  },
  async previewDataset(
    id: string,
    page = 1,
    pageSize = 25,
  ): Promise<DatasetPreview> {
    const { data } = await api.get<DatasetPreview>(`/datasets/${id}/preview`, {
      params: { page, page_size: pageSize },
    });
    return data;
  },
  async deleteDataset(id: string): Promise<void> {
    await api.delete(`/datasets/${id}`);
  },
  async upload(
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<UploadResponse> {
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await api.post<UploadResponse>("/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (evt) => {
        if (evt.total && onProgress)
          onProgress(Math.round((evt.loaded / evt.total) * 100));
      },
    });
    return data;
  },

  // Chat / agent
  async chat(req: ChatRequest): Promise<ChatResponse> {
    const { data } = await api.post<ChatResponse>("/chat", req);
    return data;
  },
  async voice(audio: Blob): Promise<ChatResponse> {
    const fd = new FormData();
    fd.append("audio", audio, "audio.webm");
    const { data } = await api.post<ChatResponse>("/voice", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  // Analysis primitives
  async generateChart(payload: {
    dataset_id: string;
    prompt?: string;
    type?: string;
  }): Promise<ChartSpec> {
    const { data } = await api.post<ChartSpec>("/generate-chart", payload);
    return data;
  },
  async generateReport(payload: {
    dataset_id: string;
    prompt?: string;
  }): Promise<Report> {
    const { data } = await api.post<Report>("/generate-report", payload);
    return data;
  },
  async detectAnomaly(payload: { dataset_id: string }): Promise<{
    anomalies: Array<Record<string, unknown>>;
  }> {
    const { data } = await api.post("/detect-anomaly", payload);
    return data;
  },
  async forecast(payload: {
    dataset_id: string;
    target: string;
    horizon?: number;
    confidence_level?: number;
    method?: string;
  }): Promise<ChartSpec> {
    const { data } = await api.post<ChartSpec>("/forecast", payload);
    return data;
  },
  async generateSql(payload: { dataset_id?: string; prompt: string }): Promise<{
    sql: string;
  }> {
    const { data } = await api.post("/generate-sql", payload);
    return data;
  },

  // Automation
  async listAutomation(): Promise<{
    services: AutomationService[];
    runs: WorkflowRun[];
  }> {
    const { data } = await api.get("/automation");
    return data;
  },
  async runAutomation(service: string): Promise<WorkflowRun> {
    const { data } = await api.post<WorkflowRun>("/automation", { service });
    return data;
  },

  // Reports
  async listReports(): Promise<Report[]> {
    const { data } = await api.get<Report[]>("/reports");
    return data;
  },
  async deleteReport(id: string): Promise<void> {
    await api.delete(`/reports/${id}`);
  },

  // History
  async listHistory(): Promise<HistoryItem[]> {
    const { data } = await api.get<HistoryItem[]>("/history");
    return data;
  },

  // Dashboard
  async getDashboard(
    params?: Record<string, string>,
  ): Promise<DashboardResponse> {
    const { data } = await api.get<DashboardResponse>("/dashboard", { params });
    return data;
  },

  // Settings
  async getSettings(): Promise<AppSettings> {
    const { data } = await api.get<AppSettings>("/settings");
    return data;
  },
  async updateSettings(payload: Partial<AppSettings>): Promise<AppSettings> {
    const { data } = await api.put<AppSettings>("/settings", payload);
    return data;
  },
};
