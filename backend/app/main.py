from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from .config import settings
from .database import init_indexes
from .routers import (
    analysis_router, auth, automation, chat, dashboard, datasets,
    history, reports, settings_router,
)


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

app.include_router(datasets.router)
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(analysis_router.router)
app.include_router(automation.router)
app.include_router(reports.router)
app.include_router(history.router)
app.include_router(dashboard.router)
app.include_router(settings_router.router)


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
