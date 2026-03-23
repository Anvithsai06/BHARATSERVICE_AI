@echo off
setlocal enabledelayedexpansion

REM ─────────────────────────────────────────────────────
REM  AI Government Service Finder — Start Script (Windows)
REM ─────────────────────────────────────────────────────

set ROOT=%~dp0
set BACKEND=%ROOT%backend
set FRONTEND=%ROOT%frontend

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║   AI Government Service Finder — GovSaathi   ║
echo  ╚══════════════════════════════════════════════╝
echo.

REM ── Check Python ──────────────────────────────────────
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Install from https://python.org
    pause
    exit /b 1
)
echo [OK] Python found

REM ── Check Node ────────────────────────────────────────
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js found

echo.

REM ── Backend setup ─────────────────────────────────────
echo [1/4] Setting up Python virtual environment...
cd /d "%BACKEND%"

if not exist "venv" (
    python -m venv venv
    echo [OK] venv created
) else (
    echo [OK] venv exists
)

call venv\Scripts\activate.bat

echo [2/4] Installing Python dependencies...
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt
echo [OK] Python packages installed

if not exist ".env" (
    copy .env.example .env >nul
    echo [OK] Created backend\.env
)

REM ── Frontend setup ────────────────────────────────────
echo [3/4] Installing frontend dependencies...
cd /d "%FRONTEND%"

if not exist "node_modules" (
    call npm install --silent
    echo [OK] npm packages installed
) else (
    echo [OK] node_modules exists
)

if not exist ".env.local" (
    copy .env.example .env.local >nul
    echo [OK] Created frontend\.env.local
)

REM ── Launch servers ─────────────────────────────────────
echo.
echo [4/4] Starting servers...
echo.

REM Start backend in new window
cd /d "%BACKEND%"
start "GovSaathi Backend" cmd /k "call venv\Scripts\activate.bat && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 3 /nobreak >nul

REM Start frontend in new window
cd /d "%FRONTEND%"
start "GovSaathi Frontend" cmd /k "npm run dev"

echo.
echo  ════════════════════════════════════════════
echo   Both servers are starting in new windows!
echo.
echo   Open in your browser:
echo   App      : http://localhost:8000
echo   API Docs : http://localhost:8000/docs
echo   Health   : http://localhost:8000/health
echo.
echo   (Next.js frontend also at localhost:3000)
echo  ════════════════════════════════════════════
echo.
echo  Close the opened terminal windows to stop.
echo.
pause
