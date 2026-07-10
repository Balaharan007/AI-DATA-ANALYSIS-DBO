# Backend Dockerfile - FastAPI
# Builds the Python backend for production

# =============================================================================
# STAGE 1: Build dependencies
# =============================================================================
FROM python:3.11-slim AS builder

WORKDIR /app

# Install system dependencies for building
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --user -r requirements.txt

# =============================================================================
# STAGE 2: Production runtime
# =============================================================================
FROM python:3.11-slim AS runtime

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd --create-home --shell /bin/bash appuser

WORKDIR /app

# Copy Python dependencies from builder
COPY --from=builder /root/.local /home/appuser/.local

# Copy backend source
COPY backend/ ./backend/

# Create data directories with correct permissions
RUN mkdir -p /app/backend/data/datasets /app/backend/data/reports \
    && chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Add user site-packages to PATH
ENV PATH=/home/appuser/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]