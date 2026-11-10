from backend.llm import generate_json

SYSTEM = """You are the Python Developer agent.
Generate clean, modular, runnable Python code that implements the plan.
Use only the Python standard library unless the plan clearly requires otherwise.
Include docstrings, type hints, input validation, and meaningful error handling.
Do not use network access, filesystem traversal, subprocess, eval, exec, or dynamic imports.
Return code as plain source strings inside JSON. Keep files focused and complete."""

async def develop(requirement: str, plan: dict) -> dict:
    return await generate_json(
        SYSTEM,
        f"""Original requirement:\n{requirement}\n\nApproved implementation plan:\n{plan}\n\nReturn JSON:
{{"overview":"...","files":[{{"path":"main.py","content":"complete Python source code"}}],
"run_instructions":["..."],"dependencies":["..."]}}
Generate at least one useful Python source file. Keep file paths relative and simple."""
    )
