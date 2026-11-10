 
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:090E2B,50:312E81,100:6D28D9&height=180&section=header&text=DevTeam%20AI%20Orchestrator&fontSize=34&fontColor=FFFFFF&fontAlignY=45&desc=Multi-Agent%20Software%20Development%20System&descSize=15&descAlignY=68&animation=fadeIn" width="100%" />

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=19&pause=1000&color=A78BFA&center=true&vCenter=true&width=650&lines=Intelligent+Multi-Agent+Collaboration;Plan+%7C+Develop+%7C+Test+%7C+Review;AI-Powered+Software+Engineering" alt="Typing SVG" />

<br/>

**An AI-Powered Multi-Agent Software Development Workspace**

<br/>

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

</div>

---

## ✨ Overview

**DevTeam AI Orchestrator** is an intelligent software development system that coordinates multiple specialized AI agents to transform software requirements into structured development workflows.

Instead of relying on a single AI assistant, DevTeam AI distributes development responsibilities across dedicated agents.

From requirement analysis to final reporting, each agent contributes to a coordinated software engineering process powered by **LangGraph**.

## 🚀 Core Capabilities

- 🤖 Multi-Agent Software Development
- 📋 Automated Requirement Analysis & Planning
- 💻 AI-Powered Code Generation
- 🔍 Automated Quality Assurance
- 🧪 Pytest Execution & Test Reporting
- 🛡️ Intelligent Code Review
- 📊 Structured Development Reports
- 🗂️ SQLite-Based Project History
- ⚡ FastAPI REST API
- 🎨 React-Based Development Workspace
- 🧠 Google Gemini Integration

## 🧠 AI Agent Team

| Agent | Responsibility |
|---|---|
| Project Planner | Analyzes requirements and creates development plans |
| Software Developer | Generates software implementation |
| QA Engineer | Examines implementation and identifies issues |
| Test Runner | Executes available automated tests |
| Code Reviewer | Evaluates code quality and suggests improvements |
| Report Generator | Creates structured development reports |

## ⚙️ System Architecture

```mermaid
flowchart TD
    A["User Requirement"] --> B["Project Planner"]
    B --> C["Software Developer"]
    C --> D["QA Engineer"]
    D --> E["Test Runner"]
    E --> F["Code Reviewer"]
    F --> G["Report Generator"]
    G --> H["Final Project Result"]
    H --> I[("SQLite Database")]

    style A fill:#312E81,color:#fff
    style H fill:#6D28D9,color:#fff
    style I fill:#164E63,color:#fff
```

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend Development |
| FastAPI | REST API |
| LangGraph | Agent Workflow Orchestration |
| Google Gemini | AI Model Integration |
| React | Frontend Interface |
| Vite | Frontend Development |
| Tailwind CSS | UI Styling |
| SQLite | Database & Persistence |
| Pytest | Automated Testing |

## 📁 Project Structure

```text
DevTeam-AI-Orchestrator/
│
├── backend/
│   ├── agents/
│   │   ├── planner.py
│   │   ├── developer.py
│   │   ├── qa_engineer.py
│   │   └── reviewer.py
│   │
│   ├── services/
│   │   ├── report_generator.py
│   │   └── test_runner.py
│   │
│   ├── workflow/
│   │   ├── graph.py
│   │   └── state.py
│   │
│   ├── config.py
│   ├── database.py
│   ├── llm.py
│   ├── main.py
│   └── schemas.py
│
├── frontend/
│   ├── src/
│   ├── index.html
│   └── package.json
│
├── .gitignore
├── README.md
└── requirements.txt
```

## 💻 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/haniaeman2026-pixel/DevTeam-AI-Orchestrator.git

cd DevTeam-AI-Orchestrator
```

### 2. Create Virtual Environment

```bash
python -m venv .venv
```

Activate on Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
GOOGLE_API_KEY=your_google_api_key
GEMINI_MODEL=your_supported_gemini_model
```

**Important:** Replace the placeholders with your actual API credentials and a model supported by your Gemini API setup. Never upload `.env` to GitHub.

### 5. Run Backend

```bash
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Backend:

```text
http://127.0.0.1:8000
```

API Documentation:

```text
http://127.0.0.1:8000/docs
```

### 6. Run Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Backend health check |
| GET | `/api/projects` | Retrieve project history |
| GET | `/api/projects/{project_id}` | Retrieve project details |
| POST | `/api/workflow/run` | Execute AI development workflow |

### Example Workflow Request

```json
{
  "requirement": "Build a Task Management REST API using FastAPI and SQLite with CRUD operations and automated tests."
}
```

## 🔄 Development Workflow

```text
USER REQUIREMENT
       |
       v
REQUIREMENT ANALYSIS
       |
       v
DEVELOPMENT PLANNING
       |
       v
AI CODE GENERATION
       |
       v
QUALITY ASSURANCE
       |
       v
AUTOMATED TESTING
       |
       v
CODE REVIEW
       |
       v
FINAL REPORT
```

## 🔮 Future Enhancements

- Real-Time Agent Execution Monitoring
- Human-in-the-Loop Approval
- Advanced Code Validation
- Multi-Language Development
- Project Export & Download
- Enhanced Workflow Analytics

---

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=22&pause=1200&color=A78BFA&center=true&vCenter=true&width=500&lines=Developed+by+Hania+Eman;AI+%26+Data+Science;Building+Intelligent+AI+Systems" alt="Developer Animation" />

<br/>

**Hania Eman**

AI & Data Science | Python | AI Agents | Machine Learning

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:090E2B,50:312E81,100:6D28D9&height=100&section=footer" width="100%" />

</div>
