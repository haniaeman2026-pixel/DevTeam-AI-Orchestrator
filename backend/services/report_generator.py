from datetime import datetime, timezone

def build_report(state: dict) -> dict:
    plan = state.get("plan", {})
    impl = state.get("implementation", {})
    qa = state.get("qa", {})
    execution = state.get("test_execution", {})
    review = state.get("review", {})
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "executive_summary": plan.get("summary", "Development workflow completed."),
        "project_title": state.get("title", "DevTeam AI project"),
        "requirement": state.get("requirement", ""),
        "architecture": plan,
        "implementation_overview": impl.get("overview", ""),
        "generated_files": [{"path": f.get("path"), "content": f.get("content")} for f in impl.get("files", [])],
        "test_strategy": qa.get("test_strategy", ""),
        "test_cases": qa.get("test_cases", []),
        "test_execution": execution,
        "code_review": review,
        "final_status": state.get("status", "completed"),
        "disclaimer": "AI-generated output requires human verification before production use. Test execution is a convenience harness, not a hardened sandbox."
    }
