#!/bin/bash
# Docker entrypoint script for Insight Engine
# Starts both backend (FastAPI) and frontend (TanStack Start) servers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Insight Engine...${NC}"

# Check required environment variables
check_env() {
    local var_name=$1
    local var_value=${!var_name}
    if [ -z "$var_value" ]; then
        echo -e "${RED}ERROR: $var_name is not set${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ $var_name is set${NC}"
}

# Validate critical env vars
check_env "GROQ_API_KEY"
check_env "MONGODB_URL"
check_env "JWT_SECRET_KEY"
check_env "CORS_ORIGINS"

# Set defaults for optional vars
export GOOGLE_DRIVE_ENABLED=${GOOGLE_DRIVE_ENABLED:-false}
export PORT=${PORT:-8000}
export FRONTEND_PORT=${FRONTEND_PORT:-5173}

# Create data directories if they don't exist
mkdir -p /app/backend/data/datasets /app/backend/data/reports

echo -e "${YELLOW}Environment:${NC}"
echo -e "  Backend port: $PORT"
echo -e "  Frontend port: $FRONTEND_PORT"
echo -e "  MongoDB: $MONGODB_URL"
echo -e "  Google Drive: $GOOGLE_DRIVE_ENABLED"

# Function to handle shutdown
shutdown() {
    echo -e "\n${YELLOW}Shutting down...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    wait
    echo -e "${GREEN}Shutdown complete${NC}"
    exit 0
}

trap shutdown SIGTERM SIGINT

# Start Backend (FastAPI with Uvicorn)
echo -e "${GREEN}Starting Backend on port $PORT...${NC}"
cd /app/backend
uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 1 &
BACKEND_PID=$!

# Wait for backend to be ready
echo -e "${YELLOW}Waiting for backend to be ready...${NC}"
for i in {1..30}; do
    if curl -f http://localhost:$PORT/health > /dev/null 2>&1; then
        echo -e "${GREEN}Backend is ready!${NC}"
        break
    fi
    sleep 1
    if [ $i -eq 30 ]; then
        echo -e "${RED}Backend failed to start within 30 seconds${NC}"
        exit 1
    fi
done

# Start Frontend (TanStack Start)
echo -e "${GREEN}Starting Frontend on port $FRONTEND_PORT...${NC}"
cd /app/frontend
PORT=$FRONTEND_PORT node .output/server/index.mjs &
FRONTEND_PID=$!

# Wait for frontend to be ready
echo -e "${YELLOW}Waiting for frontend to be ready...${NC}"
for i in {1..30}; do
    if curl -f http://localhost:$FRONTEND_PORT > /dev/null 2>&1; then
        echo -e "${GREEN}Frontend is ready!${NC}"
        break
    fi
    sleep 1
    if [ $i -eq 30 ]; then
        echo -e "${RED}Frontend failed to start within 30 seconds${NC}"
        exit 1
    fi
done

echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Insight Engine is running!                                 ║"
echo "║  Frontend: http://localhost:$FRONTEND_PORT                         ║"
echo "║  Backend API: http://localhost:$PORT                              ║"
echo "║  API Docs: http://localhost:$PORT/docs                         ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID