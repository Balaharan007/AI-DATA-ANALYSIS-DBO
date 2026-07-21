# Insight Engine - AI Data Analyst Platform

> **Full-stack AI platform for conversational data analysis, automated dashboards, and report generation.**  
> React (Frontend) • FastAPI + Groq LLM (Backend) • MongoDB Auth • File-based Storage

🔗 **Demo Drive Link:** [Google Drive Demo Folder](https://drive.google.com/drive/folders/1JDSeInUWhSbxwf4EhUVDvm-zY6g2ouhK?usp=drive_link)

---

## 🛠️ Tech Stack

| Layer                 | Technologies                                          |
| --------------------- | ----------------------------------------------------- |
| **Frontend**          | React, Recharts, Plotly                               |
| **Backend**           | FastAPI, Python, Uvicorn                              |
| **AI / LLM**          | Groq LLM                                              |
| **Data Analysis**     | Pandas, DuckDB                                        |
| **Machine Learning**  | Scikit-learn, Prophet                                 |
| **Database**          | MongoDB                                               |
| **Authentication**    | JWT (JSON Web Tokens)                                 |
| **Report Generation** | PDF, DOCX                                             |
| **Integration**       | Telegram Bot • Google Drive • Gmail • Google Calendar |
| **Deployment**        | Docker, Docker Compose                                |

---

## 🏗️ System Architecture

```text
                               👤 USER
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
           Ask Question                    Upload CSV Dataset
                 │                                 │
                 └────────────────┬────────────────┘
                                  │
                                  ▼
                  React Frontend (TanStack Start)
                                  │
                                  ▼
                    JWT Authentication (MongoDB)
                                  │
                                  ▼
                        FastAPI Backend API
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
      Dataset Service      Chat Service       Report Service
             │                    │
             ▼                    ▼
      CSV Validation      Intent Classification
             │                    │
             ▼                    ▼
      Pandas CSV Parser     Tool Routing Engine
             │                    │
             ▼                    │
     Data Cleaning & Validation   │
             │                    │
             ▼                    │
 Quality Score & Metadata         │
             │                    │
             ▼                    ▼
      Dataset Registry      Load Dataset
             │                    │
             └────────────┬───────┘
                          │
                          ▼
                  Analysis Engine
                          │
      ┌───────────────────┼────────────────────┐
      ▼                   ▼                    ▼
 Pandas Analysis     DuckDB SQL        Dashboard Builder
      │                   │                    │
      ├──────────────┬────┴────────────┐
      ▼              ▼                 ▼
 Anomaly        Forecasting      Chart Generator
 Detection        (Prophet)        (Recharts,Plotly)
(Isolation Forest)
      │
      ▼
 Groq LLM (Explanation Only)
      │
      ▼
 Response Formatter
      │
 ┌────┼───────────────┬──────────────┐
 ▼    ▼               ▼              ▼
Text Charts      SQL Result      Insights
      │
      ▼
 Report Generator
      │
 ┌────┼──────────────┐
 ▼    ▼              ▼
PDF  DOCX   Telegram Bot Upload -> (Drive,Calender)
      │
      ▼
 Final API Response
      │
      ▼
 React Dashboard
```

---
## ⚙️ Required Configuration

Before running the project, configure the required API key.

### 1. Groq API Setup

1. Create a **Groq API key** from the Groq Console.
2. Open the `.env.example` file.
3. Add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

4. Rename the `.env.example` file to `.env`.

> **Important:** Never commit your `.env` file to GitHub. Make sure `.env` is included in `.gitignore`.

---

## 🤖 Telegram Setup (Optional)

Telegram integration is optional. The main application will work without it.

### 1. Create a Telegram Bot

1. Open Telegram and search for **@BotFather**.
2. Send `/newbot`.
3. Follow the instructions to create your bot.
4. Copy the generated **Bot Token**.

### 2. Get Your Telegram Chat ID

1. Open your newly created Telegram bot.
2. Click **Start** or send any message to the bot.
3. Open the following URL in your browser:

```text
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

Replace `<YOUR_BOT_TOKEN>` with your actual Telegram bot token.

4. In the JSON response, find:

```json
"chat": {
  "id": 123456789
}
```

The number `123456789` is your **Telegram Chat ID**.

### 3. Update the Environment Variables

Add the Bot Token and Chat ID to your `.env` file:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
```

> **Important:** Never share your Telegram Bot Token or commit your `.env` file to GitHub.


## 🚀 Local Deployment

```bash
# 1. Backend
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env → add GROQ_API_KEY, MONGODB_URL, JWT_SECRET_KEY
uvicorn app.main:app --reload --port 8000

# 2. Frontend
cd frontend
npm install
npm run dev
# Opens http://localhost:5173
```

---

## 🐳 Docker Deployment

```bash
# Build & run with docker-compose
docker compose --env-file backend/.env up -d --build
docker-compose up -d --build

# Services:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:8000
# - API Docs: http://localhost:8000/docs
# - MongoDB: localhost:27017
```

**Required env vars for Docker:**

```bash
GROQ_API_KEY=your_groq_key
MONGODB_URL=mongodb://mongodb:27017
JWT_SECRET_KEY=your_32_char_min_secret
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 🔑 Required Environment Variables

| Variable             | Description                            | Required |
| -------------------- | -------------------------------------- | -------- |
| `GROQ_API_KEY`       | Groq API key for LLM/Vision/Whisper    | ✅ Yes   |
| `MONGODB_URL`        | MongoDB connection string              | ✅ Yes   |
| `JWT_SECRET_KEY`     | HS256 signing key (min 32 chars)       | ✅ Yes   |
| `CORS_ORIGINS`       | Comma-separated frontend origins       | ✅ Yes   |
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather              | ✅ Yes   |
| `TELEGRAM_CHAT_ID`   | Chat/group/channel ID to send files to | ✅ Yes   |

---

## 📚 Deep-Dive Documentation

| Document                                             | Focus                                                                                     |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [`PROCESS_OF_BACKEND.md`](./PROCESS_OF_BACKEND.md)   | Config, models, storage, all 8 services, routers, Groq client, auth, sandbox, deployment  |
| [`PROCESS_OF_FRONTEND.md`](./PROCESS_OF_FRONTEND.md) | Routing, TanStack Query, component system, page flows, API contract, patterns, deployment |
| [`PROJECT_SUMMARY.md`](./PROJECT_SUMMARY.md)         | Full conversation history, tech stack, API overview, troubleshooting                      |

---
