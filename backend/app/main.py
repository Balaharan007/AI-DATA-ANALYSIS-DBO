from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from .core.config import settings
from .core.database import init_indexes
from .domains.auth.routers import router as auth_router
from .domains.datasets.routers import router as datasets_router
from .domains.chat.routers import router as chat_router
from .domains.analysis.routers import router as analysis_router
from .domains.automation.routers import router as automation_router
from .domains.reports.routers import router as reports_router
from .domains.history.routers import router as history_router
from .domains.dashboard.router import router as dashboard_router
from .domains.settings.routers import router as settings_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_indexes()
    yield
    # Shutdown (if needed)


app = FastAPI(title="Insight Engine API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=settings.cors_origin_regex or None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve generated reports / assets
app.mount("/files", StaticFiles(directory=settings.data_dir), name="files")

app.include_router(datasets_router)
app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(analysis_router)
app.include_router(automation_router)
app.include_router(reports_router)
app.include_router(history_router)
app.include_router(dashboard_router)
app.include_router(settings_router)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": str(exc)})


@app.get("/")
async def root():
    return {"status": "ok", "service": "Insight Engine API"}


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "groq_configured": bool(settings.groq_api_key),
    }