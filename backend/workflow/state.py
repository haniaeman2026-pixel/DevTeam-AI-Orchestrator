from typing import TypedDict, Any

class DevTeamState(TypedDict, total=False):
    project_id: str
    title: str
    requirement: str
    plan: dict[str, Any]
    implementation: dict[str, Any]
    qa: dict[str, Any]
    test_execution: dict[str, Any]
    review: dict[str, Any]
    report: dict[str, Any]
    status: str
    error: str
    agent_events: list[dict[str, Any]]
