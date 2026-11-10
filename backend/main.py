from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.schemas import WorkflowRequest
from backend.workflow.graph import run_workflow
from backend.database import init_db, save_project, list_projects, get_project

app = FastAPI(title="DevTeam AI API", version="1.0.0", description="Multi-agent software development workspace")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "DevTeam AI", "version": "1.0.0"}

@app.get("/api/projects")
def projects():
    return {"projects": list_projects()}

@app.get("/api/projects/{project_id}")
def project_detail(project_id: str):
    result = get_project(project_id)
    if not result:
        raise HTTPException(status_code=404, detail="Project not found")
    return result

@app.post("/api/workflow/run")
async def execute_workflow(payload: WorkflowRequest):
    try:
        result = await run_workflow(payload.requirement)
        save_project(result)
        return result
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Workflow failed: {type(exc).__name__}: {exc}")
