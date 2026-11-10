import uuid
from datetime import datetime, timezone
from langgraph.graph import StateGraph, END
from backend.workflow.state import DevTeamState
from backend.agents.planner import plan
from backend.agents.developer import develop
from backend.agents.qa_engineer import create_tests
from backend.agents.reviewer import review
from backend.services.test_runner import run_tests
from backend.services.report_generator import build_report

def _event(events, agent, status, detail):
    events.append({"agent": agent, "status": status, "detail": detail,
                   "timestamp": datetime.now(timezone.utc).isoformat()})

async def planner_node(state: DevTeamState):
    events = list(state.get("agent_events", []))
    _event(events, "Project Planner", "running", "Analyzing requirements and designing the implementation.")
    result = await plan(state["requirement"])
    _event(events, "Project Planner", "completed", "Implementation plan created.")
    return {"plan": result, "title": result.get("project_title", "Untitled project"), "agent_events": events}

async def developer_node(state: DevTeamState):
    events = list(state.get("agent_events", []))
    _event(events, "Python Developer", "running", "Generating modular Python source files.")
    result = await develop(state["requirement"], state["plan"])
    _event(events, "Python Developer", "completed", f"Generated {len(result.get('files', []))} source file(s).")
    return {"implementation": result, "agent_events": events}

async def qa_node(state: DevTeamState):
    events = list(state.get("agent_events", []))
    _event(events, "QA Engineer", "running", "Designing unit tests and edge cases.")
    result = await create_tests(state["requirement"], state["plan"], state["implementation"].get("files", []))
    _event(events, "QA Engineer", "completed", f"Created {len(result.get('test_files', []))} test file(s).")
    return {"qa": result, "agent_events": events}

async def execution_node(state: DevTeamState):
    events = list(state.get("agent_events", []))
    _event(events, "Test Runner", "running", "Executing generated pytest suite in a temporary directory.")
    result = run_tests(state["implementation"].get("files", []), state["qa"].get("test_files", []))
    _event(events, "Test Runner", result["status"], f"Tests: {result.get('passed', 0)} passed, {result.get('failed', 0)} failed.")
    return {"test_execution": result, "agent_events": events}

async def reviewer_node(state: DevTeamState):
    events = list(state.get("agent_events", []))
    _event(events, "Code Reviewer", "running", "Reviewing implementation, requirements, and actual test results.")
    result = await review(state["requirement"], state["plan"], state["implementation"].get("files", []),
                          state["qa"], state["test_execution"])
    _event(events, "Code Reviewer", "completed", "Code review completed.")
    return {"review": result, "agent_events": events}

def report_node(state: DevTeamState):
    final_state = dict(state)
    final_state["status"] = "completed"
    return {"status": "completed", "report": build_report(final_state)}

def build_graph():
    graph = StateGraph(DevTeamState)
    graph.add_node("planner", planner_node)
    graph.add_node("developer", developer_node)
    graph.add_node("qa", qa_node)
    graph.add_node("execute_tests", execution_node)
    graph.add_node("reviewer", reviewer_node)
    graph.add_node("report", report_node)
    graph.set_entry_point("planner")
    graph.add_edge("planner", "developer")
    graph.add_edge("developer", "qa")
    graph.add_edge("qa", "execute_tests")
    graph.add_edge("execute_tests", "reviewer")
    graph.add_edge("reviewer", "report")
    graph.add_edge("report", END)
    return graph.compile()

workflow = build_graph()

async def run_workflow(requirement: str) -> dict:
    requirement = requirement.strip()
    if len(requirement) < 20:
        raise ValueError("Requirement must contain at least 20 characters.")
    initial = {
        "project_id": str(uuid.uuid4()),
        "requirement": requirement,
        "agent_events": [],
        "status": "running",
    }
    result = await workflow.ainvoke(initial)
    result["created_at"] = datetime.now(timezone.utc).isoformat()
    result["report"] = build_report(result)
    return result
