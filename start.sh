#!/usr/bin/env bash
set -e

# ─────────────────────────────────────────────────────────
#  AI Government Service Finder — Start Script (Linux/Mac)
# ─────────────────────────────────────────────────────────

ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${CYAN}╔═════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   AI Government Service Finder — BHARATSERVICE  ║${NC}"
echo -e "${CYAN}╚═════════════════════════════════════════════════╝${NC}"
echo ""

# ── Check Python ───────────────────────────────────────
if ! command -v python3 &>/dev/null; then
  echo -e "${RED}✗ Python 3 not found. Install from https://python.org${NC}"
  exit 1
fi
PYTHON=$(command -v python3)
echo -e "${GREEN}✓ Python: $($PYTHON --version)${NC}"

# ── Check Node ─────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo -e "${RED}✗ Node.js not found. Install from https://nodejs.org${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Node: $(node --version)${NC}"

# ── Check npm ──────────────────────────────────────────
if ! command -v npm &>/dev/null; then
  echo -e "${RED}✗ npm not found.${NC}"
  exit 1
fi
echo -e "${GREEN}✓ npm: $(npm --version)${NC}"

echo ""

# ── Backend setup ──────────────────────────────────────
echo -e "${YELLOW}[1/4] Setting up Python virtual environment…${NC}"
cd "$BACKEND"

if [ ! -d "venv" ]; then
  $PYTHON -m venv venv
  echo -e "${GREEN}✓ venv created${NC}"
else
  echo -e "${GREEN}✓ venv exists${NC}"
fi

source venv/bin/activate

echo -e "${YELLOW}[2/4] Installing Python dependencies…${NC}"
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt
echo -e "${GREEN}✓ Python packages installed${NC}"

# Copy .env if not present
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo -e "${GREEN}✓ Created backend/.env from example${NC}"
fi

# ── Frontend setup ─────────────────────────────────────
echo -e "${YELLOW}[3/4] Installing frontend dependencies…${NC}"
cd "$FRONTEND"

if [ ! -d "node_modules" ]; then
  npm install --silent
  echo -e "${GREEN}✓ npm packages installed${NC}"
else
  echo -e "${GREEN}✓ node_modules exists${NC}"
fi

if [ ! -f ".env.local" ]; then
  cp .env.example .env.local
  echo -e "${GREEN}✓ Created frontend/.env.local${NC}"
fi

# ── Launch both servers ────────────────────────────────
echo ""
echo -e "${YELLOW}[4/4] Starting servers…${NC}"
echo ""

# Start backend in background
cd "$BACKEND"
source venv/bin/activate
echo -e "${CYAN}▶ Backend  → http://localhost:8000${NC}"
echo -e "${CYAN}▶ API Docs → http://localhost:8000/docs${NC}"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

sleep 2

# Start frontend in background
cd "$FRONTEND"
echo -e "${CYAN}▶ Frontend → http://localhost:3000${NC}"
echo ""
npm run dev &
FRONTEND_PID=$!

echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Both servers are running!${NC}"
echo ""
echo -e "${GREEN}  Open in your browser:${NC}"
echo -e "${CYAN}  App      → http://localhost:8000${NC}"
echo -e "${CYAN}  API Docs → http://localhost:8000/docs${NC}"
echo -e "${CYAN}  Health   → http://localhost:8000/health${NC}"
echo ""
echo -e "${GREEN}  (Next.js frontend also at localhost:3000)${NC}"
echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}  Press Ctrl+C to stop both servers.${NC}"
echo ""

# Wait & handle shutdown cleanly
trap "echo ''; echo -e '${RED}Stopping servers…${NC}'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM
wait $BACKEND_PID $FRONTEND_PID
