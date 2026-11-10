# DevTeam AI

Enterprise-style multi-agent software development workspace built with FastAPI, LangGraph, Groq GPT-OSS, React, Vite, Tailwind CSS, and Pytest.

## Agent workflow

1. Project Planner — requirements analysis and implementation plan.
2. Python Developer — modular Python source generation.
3. QA Engineer — pytest test suite and edge-case strategy.
4. Test Runner — executes the generated tests in a temporary working directory.
5. Code Reviewer — reviews code and actual test output.
6. Report Generator — assembles the final development report.

## Prerequisites

- Python 3.11 or 3.12 recommended
- Node.js 20 or newer
- A Groq API key

## Backend setup (PowerShell)

```powershell
cd backend
py -3.12 -m venv ..\.venv
..\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `backend\.env` and set `GROQ_API_KEY`. Default model: `openai/gpt-oss-20b`.

Run the backend from the project root:

```powershell
cd ..
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

API docs: http://127.0.0.1:8000/docs

## Frontend setup (second terminal)

```powershell
cd frontend
npm install
npm run dev
```

Open http://127.0.0.1:5173

## Tests

From the project root with the virtual environment active:

```powershell
python -m pytest -q
```

## Security note

Generated code is untrusted input. The included temporary-directory pytest runner uses basic AST checks and a timeout, but it is **not a hardened sandbox**. Do not expose this runner to untrusted users or production workloads. Production deployment should execute generated code in disposable, network-disabled containers with CPU/memory/process limits, a non-root user, and strict filesystem isolation.

## Environment variables

See `backend/.env.example`. Never commit `.env` or expose the Groq key in frontend code.
