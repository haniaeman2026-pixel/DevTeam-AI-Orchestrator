from backend.llm import generate_json

SYSTEM = """You are the QA Engineer agent.
Create meaningful pytest tests for the supplied Python implementation.
Cover normal behavior, invalid input, boundary conditions, and edge cases.
Tests must import the generated module correctly. Do not claim tests passed; execution results are supplied separately."""

async def create_tests(requirement: str, plan: dict, files: list[dict]) -> dict:
    return await generate_json(
        SYSTEM,
        f"""Requirement:\n{requirement}\nPlan:\n{plan}\nGenerated files:\n{files}\n\nReturn JSON:
{{"test_strategy":"...","test_cases":[{{"name":"...","scenario":"...","expected":"..."}}],
"test_files":[{{"path":"test_main.py","content":"complete pytest test source"}}]}}"""
    )
