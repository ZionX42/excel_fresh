[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# excel_fresh

A small full‑stack app with FastAPI backend and React (Vite) frontend.

## Prerequisites
- Python 3.11+ (you have 3.13)
- Node.js 18+ (recommended) and npm
- Optional: MongoDB local instance at `mongodb://localhost:27017`

## Setup

### Backend
1. Create a virtual environment and install deps:
```
python -m venv app/backend/.venv
app/backend/.venv/Scripts/Activate.ps1
pip install -r app/backend/requirements.txt
```
2. Configure env (optional)
- Copy `app/.env.example` to `app/backend/.env` and adjust as needed.
3. Run API:
```
app/backend/.venv/Scripts/Activate.ps1
cd app/backend
python -m uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend
1. Install deps:
```
cd app/frontend
npm install
```
2. Configure env:
- Copy `app/.env.example` into `app/frontend/.env` and set `VITE_BACKEND_URL`.
3. Run dev server:
```
npm run dev
# open http://127.0.0.1:3000
```
4. Build production:
```
npm run build
npm run preview
```

## Monorepo convenience scripts
From the repo root, you can use npm scripts to run both backend and frontend.

### Install root tooling
```
cd app/frontend
npm install concurrently cross-env --save-dev
```

Then in package.json at the root (optional), add scripts to run both.

## Notes
- Frontend uses Vite with React. API base is read from `import.meta.env.VITE_BACKEND_URL` (fallback to `REACT_APP_BACKEND_URL` or http://localhost:8000).
- Backend gracefully handles MongoDB being offline for `/api/generate` and `/api/generations`.
- Build output remains `app/frontend/build/` for compatibility.
