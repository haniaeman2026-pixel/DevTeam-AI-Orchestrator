from backend.llm import generate_json

SYSTEM = """You are the Project Planner, a senior software architect.
Analyze the user's software requirement. Produce a practical Python implementation plan.
Be precise, identify assumptions, core modules, functions, data flow, validation, and risks.
Do not write implementation code."""

async def plan(requirement: str) -> dict:
    return await generate_json(
        SYSTEM,
        f"""Analyze this requirement:\n{requirement}\n\nReturn JSON with:
{{"project_title":"short title","summary":"2-3 sentences","assumptions":["..."],
"features":["..."],"modules":[{{"name":"...","purpose":"..."}}],
"functions":[{{"name":"...","purpose":"...","inputs":"...","outputs":"..."}}],
"implementation_steps":["..."],"risks":["..."]}}"""
    )
