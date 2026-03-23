# 🇮🇳 BHARATSERVICE — AI Government Service Finder

A production-ready SaaS platform for discovering and navigating Indian government services using AI-powered semantic search and an intelligent chat assistant.

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Manual Setup](#manual-setup)
- [LM Studio Setup (AI)](#lm-studio-setup)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Deployment](#deployment)

---

## ✨ Features

- 🔍 **Semantic Search** — Natural language queries powered by FAISS + sentence-transformers
- 💬 **AI Chat Assistant** — Step-by-step guidance via a locally hosted LLM (LM Studio)
- 🔗 **Official Links Only** — Every result links to verified `.gov.in` portals
- 📂 **30+ Services** — Identity, Health, Agriculture, Finance, Transport, and more
- 🚀 **No Login Required** — Instantly accessible to every citizen
- 📱 **Responsive Design** — Works on mobile, tablet, and desktop
- 🔒 **Privacy-First** — AI runs locally; no data leaves your server

---

## 🏗️ Architecture

```
User (Browser)
    ↓
Frontend (Next.js 14 — Port 3000)
    ↓
Backend API (FastAPI — Port 8000)
    ├── /api/search   → FAISS Semantic Search Engine
    ├── /api/chat     → LM Studio LLM Integration
    ├── /api/services → Government Services Dataset
    └── /health       → System health check
            ↓
    Local LLM (LM Studio — Port 1234)
```

---

## ✅ Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.10+ | https://python.org |
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | Bundled with Node.js |
| LM Studio | Latest | https://lmstudio.ai *(optional for AI chat)* |

---

## ⚡ Quick Start

### Linux / macOS

```bash
# Clone / extract the project
cd ai-gov-finder

# Make start script executable
chmod +x start.sh

# Run everything with one command
./start.sh
```

### Windows

```bat
# Double-click start.bat  OR  run in Command Prompt:
start.bat
```

The script will:
1. Create a Python virtual environment
2. Install all Python dependencies
3. Install all Node.js dependencies
4. Start the backend on **http://localhost:8000**
5. Start the frontend on **http://localhost:3000**

---

## 🔧 Manual Setup

### Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate.bat

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start the server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🤖 LM Studio Setup

The AI chat works with or without LM Studio. Without it, a smart keyword-based fallback provides helpful responses.

**To enable full AI responses:**

1. Download LM Studio from **https://lmstudio.ai**
2. Open LM Studio and download any model (recommended: `Mistral 7B Instruct` or `Llama 3 8B Instruct`)
3. Go to **Local Server** tab in LM Studio
4. Load your downloaded model
5. Click **Start Server** (default port: `1234`)
6. The backend will automatically detect LM Studio and use it

**Verify connection:**
```bash
curl http://localhost:8000/health
# Should return: {"status":"ok","ai_connected":true,...}
```

---

## 📁 Project Structure

```
ai-gov-finder/
├── start.sh              # Linux/Mac one-click startup
├── start.bat             # Windows one-click startup
├── README.md
│
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI app entry point
│   │   ├── ai/
│   │   │   └── llm_service.py    # LM Studio integration + fallback
│   │   ├── models/
│   │   │   └── schemas.py        # Pydantic data models
│   │   ├── routes/
│   │   │   ├── search.py         # POST /api/search
│   │   │   ├── chat.py           # POST /api/chat
│   │   │   ├── services.py       # GET  /api/services
│   │   │   └── health.py         # GET  /health
│   │   ├── search/
│   │   │   └── engine.py         # FAISS semantic search engine
│   │   └── services/
│   │       └── dataset_service.py
│   ├── data/
│   │   └── services.json         # 30+ government services dataset
│   ├── .env                      # Environment variables
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx         # Root layout
    │   │   ├── page.tsx           # Main page
    │   │   └── globals.css        # Global styles + design tokens
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Header.tsx
    │   │   │   └── Footer.tsx
    │   │   ├── search/
    │   │   │   ├── HeroSearch.tsx       # Search bar + suggestions
    │   │   │   ├── ResultsSection.tsx   # Results grid
    │   │   │   ├── ServiceCard.tsx      # Individual service card
    │   │   │   ├── SkeletonCard.tsx     # Loading skeleton
    │   │   │   └── CategoriesSection.tsx
    │   │   ├── chat/
    │   │   │   ├── ChatPanel.tsx        # Full chat interface
    │   │   │   ├── MessageBubble.tsx    # Chat message component
    │   │   │   ├── TypingIndicator.tsx  # AI typing animation
    │   │   │   └── ChatFAB.tsx          # Floating action button
    │   │   └── ui/
    │   │       └── FeaturesSection.tsx
    │   ├── store/
    │   │   └── index.ts           # Zustand state management
    │   ├── types/
    │   │   └── index.ts           # TypeScript interfaces
    │   └── utils/
    │       └── api.ts             # API client functions
    ├── .env.local
    ├── package.json
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## 📡 API Reference

### `POST /api/search`
Search for government services using natural language.

**Request:**
```json
{
  "query": "how to apply for a passport",
  "top_k": 6
}
```

**Response:**
```json
{
  "query": "how to apply for a passport",
  "results": [...],
  "total": 3
}
```

---

### `POST /api/chat`
Chat with the AI assistant about government services.

**Request:**
```json
{
  "message": "What documents do I need for a passport?",
  "history": [],
  "service_context": "optional context string"
}
```

**Response:**
```json
{
  "response": "To apply for a passport, you need..."
}
```

---

### `GET /api/services`
List all government services.

### `GET /api/services/categories`
List all categories.

### `GET /health`
System health check (returns AI connection status).

---

## 🚀 Deployment

### Frontend — Vercel

```bash
cd frontend
npx vercel --prod
```
Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.com`

### Backend — Any Linux VPS / Cloud VM

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
```

Use **nginx** as a reverse proxy and **supervisor** or **systemd** to keep it running.

### Example nginx config for backend:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## ⚠️ Important Notes

- This is **not** an official Government of India platform
- Always verify information on official `.gov.in` portals before taking action
- The AI may make mistakes — treat it as a guide, not a final authority
- LM Studio must be running locally for full AI responses; otherwise, the smart fallback system handles common queries

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Python 3.10+ and `pip install -r requirements.txt` |
| Frontend won't start | Run `npm install` in `frontend/` directory |
| AI chat not working | Start LM Studio and load a model on port 1234 |
| CORS errors | Ensure `ALLOWED_ORIGINS` in `backend/.env` includes frontend URL |
| Search returns no results | Backend may still be loading the embedding model (wait ~30s) |
| Port 8000 in use | Change port in `.env` and update `frontend/.env.local` |

---

*Built with ❤️ for Indian Citizens*
