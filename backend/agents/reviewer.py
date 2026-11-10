from backend.llm import generate_json

SYSTEM = """You are a senior Python Code Reviewer.
Review the implementation and tests against the original requirement.
Look for correctness, missing requirements, security risks, error handling, maintainability, and test coverage.
Be evidence-based: cite filenames and explain impact. Do not invent runtime test results."""

async def review(requirement: str, plan: dict, files: list[dict], tests: dict, execution: dict) -> dict:
    return await generate_json(
        SYSTEM,
        f"""Requirement:\n{requirement}\nPlan:\n{plan}\nImplementation:\n{files}\nQA plan:\n{tests}\nActual test execution:\n{execution}\n\nReturn JSON:
{{"overall_status":"approved or changes_requested","quality_score":0,
"findings":[{{"severity":"low|medium|high|critical","file":"...","issue":"...","recommendation":"..."}}],
"missing_requirements":["..."],"strengths":["..."],"recommendations":["..."]}}"""
    )
