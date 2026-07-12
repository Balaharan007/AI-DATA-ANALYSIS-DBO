from __future__ import annotations

from datetime import datetime
from typing import Any, Literal, Optional

from pydantic import BaseModel, EmailStr, Field


class ColumnMeta(BaseModel):
    name: str
    dtype: str
    unique: Optional[int] = None
    missing: Optional[int] = None
    is_primary_key: Optional[bool] = None
    is_foreign_key: Optional[bool] = None


class Dataset(BaseModel):
    id: str
    name: str
    type: str  # "csv" | "pdf" | "docx" | "image"
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


ChartType = Literal[
    "bar", "line", "pie", "scatter", "heatmap", "histogram",
    "treemap", "box", "area", "radar", "bubble", "waterfall", "sunburst",
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
    status: str
    detail: Optional[str] = None


class ChatMessage(BaseModel):
    id: str
    role: str
    created_at: str
    blocks: list[ChatBlock]
    execution: Optional[list[ExecutionStep]] = None


class ChatRequest(BaseModel):
    message: str
    dataset_id: Optional[str] = None
    conversation_id: Optional[str] = None
    action: Optional[str] = None
    user_id: Optional[str] = None


class ChatResponse(BaseModel):
    conversation_id: str
    message: ChatMessage


class Report(BaseModel):
    id: str
    name: str
    created_at: str
    dataset_id: Optional[str] = None
    dataset_name: Optional[str] = None
    url: Optional[str] = None
    preview_url: Optional[str] = None
    docx_url: Optional[str] = None
    telegram_sent: Optional[bool] = False
    telegram_pdf_message_id: Optional[int] = None
    telegram_docx_message_id: Optional[int] = None


class HistoryItem(BaseModel):
    id: str
    kind: str
    title: str
    created_at: str
    meta: Optional[dict[str, Any]] = None


class AutomationService(BaseModel):
    id: str
    name: str
    label: str
    connected: bool
    last_run: Optional[str] = None


class WorkflowRun(BaseModel):
    id: str
    service: str
    status: str
    created_at: str
    message: Optional[str] = None


class AppSettings(BaseModel):
    groq_model: str = "llama-3.3-70b-versatile"
    temperature: float = 0.3
    language: str = "en"
    theme: str = "dark"
    automation_enabled: bool = False
    voice_enabled: bool = True
    notifications_enabled: bool = True


class GenerateChartRequest(BaseModel):
    dataset_id: str
    prompt: Optional[str] = None
    type: Optional[str] = None


class GenerateReportRequest(BaseModel):
    dataset_id: str
    prompt: Optional[str] = None
    user_id: Optional[str] = None


class DetectAnomalyRequest(BaseModel):
    dataset_id: str


class ForecastRequest(BaseModel):
    dataset_id: str
    target: str
    horizon: Optional[int] = 6
    confidence_level: Optional[float] = 0.95
    method: Optional[str] = "auto"  # "prophet", "linear", "auto"


class GenerateSqlRequest(BaseModel):
    dataset_id: Optional[str] = None
    prompt: str


# --- Auth Models ---

class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


class UserInDB(BaseModel):
    id: str
    name: str
    email: str
    password_hash: str
    created_at: datetime
    updated_at: datetime
