 
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=venom&height=260&text=DevTeam%20AI&fontSize=76&fontColor=FFFFFF&stroke=8B5CF6&strokeWidth=2&animation=fadeIn&color=0:080B20,40:24105C,100:6D28D9" width="100%" />

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=18&duration=2800&pause=900&color=C4B5FD&center=true&vCenter=true&width=750&lines=AI-Powered+Software+Engineering;Your+Intelligent+Multi-Agent+Development+Team;Plan.+Build.+Test.+Review.+Deliver." />

<br/>

<sub>AN INTELLIGENT MULTI-AGENT SOFTWARE DEVELOPMENT WORKSPACE</sub>

<br/><br/>

[![Python](https://img.shields.io/badge/Python-0B1026?style=for-the-badge&logo=python&logoColor=60A5FA)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0B1026?style=for-the-badge&logo=fastapi&logoColor=34D399)](https://fastapi.tiangolo.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-0B1026?style=for-the-badge&logo=langchain&logoColor=A78BFA)](https://www.langchain.com/langgraph)
[![Gemini](https://img.shields.io/badge/Gemini_AI-0B1026?style=for-the-badge&logo=googlegemini&logoColor=60A5FA)](https://ai.google.dev)
[![React](https://img.shields.io/badge/React-0B1026?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)

<br/>

**Turning Software Requirements Into Intelligent Development Workflows.**

</div>

---

## ◈ THE VISION

DevTeam AI Orchestrator introduces a collaborative approach to software engineering.

Instead of depending on one general-purpose AI assistant, it coordinates a specialized team of AI agents. Each agent handles a dedicated development responsibility, working together through an orchestrated LangGraph workflow.

From the first requirement to the final development report, the system brings planning, implementation, testing, and code review into one unified workspace.

## ◈ MEET YOUR AI DEVELOPMENT TEAM

<table>
<tr>
<td width="50%">

### ◉ 01 — PROJECT PLANNER

Analyzes user requirements and transforms them into structured development plans.

</td>
<td width="50%">

### ◉ 02 — SOFTWARE DEVELOPER

Generates project implementation based on the approved development plan.

</td>
</tr>
<tr>
<td width="50%">

### ◉ 03 — QA ENGINEER

Evaluates implementation quality and identifies potential issues.

</td>
<td width="50%">

### ◉ 04 — TEST RUNNER

Executes available automated tests using Pytest.

</td>
</tr>
<tr>
<td width="50%">

### ◉ 05 — CODE REVIEWER

Reviews code quality, identifies weaknesses, and suggests improvements.

</td>
<td width="50%">

### ◉ 06 — REPORT GENERATOR

Produces a structured summary of the development workflow and results.

</td>
</tr>
</table>

## ◈ INTELLIGENT WORKFLOW

<div align="center">

```mermaid
flowchart TD
    A(["USER REQUIREMENT"]) --> B["PROJECT PLANNER"]
    B --> C["SOFTWARE DEVELOPER"]
    C --> D["QA ENGINEER"]
    D --> E["AUTOMATED TEST RUNNER"]
    E --> F["CODE REVIEWER"]
    F --> G["REPORT GENERATOR"]
    G --> H(["FINAL PROJECT RESULT"])
    H --> I[("SQLITE DATABASE")]

    style A fill:#312E81,color:#fff,stroke:#A78BFA
    style B fill:#171B3B,color:#C4B5FD,stroke:#8B5CF6
    style C fill:#171B3B,color:#C4B5FD,stroke:#8B5CF6
    style D fill:#171B3B,color:#C4B5FD,stroke:#8B5CF6
    style E fill:#171B3B,color:#C4B5FD,stroke:#8B5CF6
    style F fill:#171B3B,color:#C4B5FD,stroke:#8B5CF6
    style G fill:#171B3B,color:#C4B5FD,stroke:#8B5CF6
    style H fill:#6D28D9,color:#fff,stroke:#C4B5FD
    style I fill:#164E63,color:#fff,stroke:#67E8F9
```

**ONE REQUIREMENT → SIX SPECIALIZED AGENTS → ONE COORDINATED RESULT**

</div>

## ◈ CORE CAPABILITIES

| Capability | Description |
|---|---|
| Multi-Agent AI | Specialized agents for development tasks |
| Requirement Analysis | Automated project understanding |
| Code Generation | AI-powered implementation |
| Quality Assurance | Automated implementation review |
| Test Automation | Pytest execution |
| Code Intelligence | AI-assisted code review |
| Project History | SQLite persistence |
| API Integration | FastAPI backend |
| AI Integration | Google Gemini |
| Web Workspace | React-based frontend |

## ◈ TECHNOLOGY ECOSYSTEM

<div align="center">

| BACKEND | AI & ORCHESTRATION | FRONTEND | STORAGE & TESTING |
|:---:|:---:|:---:|:---:|
| Python | Gemini | React | SQLite |
| FastAPI | LangGraph | Vite | Pytest |
| REST API | AI Agents | Tailwind CSS | Database |

</div>

## ◈ PROJECT ARCHITECTURE

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

## ◈ GETTING STARTED

**01. Clone the Repository**

```bash
git clone https://github.com/haniaeman2026-pixel/DevTeam-AI-Orchestrator.git
cd DevTeam-AI-Orchestrator
```

**02. Create Virtual Environment**

```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**03. Install Dependencies**

```bash
pip install -r requirements.txt
```

**04. Configure API Credentials**

Create `.env` in the root directory:

```env
GOOGLE_API_KEY=your_google_api_key
GEMINI_MODEL=your_supported_gemini_model
```

Never commit your API credentials to GitHub.

**05. Launch Backend**

```bash
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

**06. Launch Frontend**

```bash
cd frontend
npm install
npm run dev
```

<div align="center">

| SERVICE | LOCAL ADDRESS |
|:---|:---|
| Backend | `http://127.0.0.1:8000` |
| API Documentation | `http://127.0.0.1:8000/docs` |
| Frontend | `http://localhost:5173` |

</div>

## ◈ API REFERENCE

| METHOD | ENDPOINT | FUNCTION |
|:---:|---|---|
| GET | `/api/health` | Backend status |
| GET | `/api/projects` | Project history |
| GET | `/api/projects/{project_id}` | Project details |
| POST | `/api/workflow/run` | Execute AI workflow |

**Example Request**

```json
{
  "requirement": "Build a Task Management REST API using FastAPI and SQLite with CRUD operations and automated tests."
}
```

## ◈ WHAT'S NEXT?

- Real-Time Agent Monitoring
- Human Approval Checkpoints
- Advanced Code Validation
- Multi-Language Development
- Project Export Capabilities
- Enhanced Workflow Analytics

---

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=24&pause=1200&color=A78BFA&center=true&vCenter=true&width=600&lines=Developed+by+Hania+Eman;AI+%26+Data+Science+Developer;Building+Intelligent+AI+Systems" />

<br/>

**HANIA EMAN**

<sub>AI & DATA SCIENCE · PYTHON · AI AGENTS · MACHINE LEARNING</sub>

<br/><br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:080B20,50:312E81,100:6D28D9&height=130&section=footer" width="100%" />

</div>
