import ast
import os
import subprocess
import sys
import tempfile
from pathlib import Path

# This runner is a convenience test harness, NOT a hardened security sandbox.
# For production, execute untrusted generated code inside a disposable container
# with no network, read-only base filesystem, resource limits, and a non-root user.

BLOCKED_IMPORTS = {"subprocess", "socket", "requests", "httpx", "urllib", "ctypes", "multiprocessing"}

def _validate_python(source: str):
    tree = ast.parse(source)
    for node in ast.walk(tree):
        if isinstance(node, (ast.Exec,)) if hasattr(ast, "Exec") else False:
            raise ValueError("Dynamic execution is not allowed.")
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id in {"eval", "exec", "compile", "__import__"}:
            raise ValueError(f"Blocked dynamic execution call: {node.func.id}")
        if isinstance(node, ast.Import):
            for alias in node.names:
                if alias.name.split(".")[0] in BLOCKED_IMPORTS:
                    raise ValueError(f"Blocked import: {alias.name}")
        if isinstance(node, ast.ImportFrom) and node.module and node.module.split(".")[0] in BLOCKED_IMPORTS:
            raise ValueError(f"Blocked import: {node.module}")

def run_tests(source_files: list[dict], test_files: list[dict]) -> dict:
    all_files = source_files + test_files
    if not source_files or not test_files:
        return {"status": "not_run", "passed": 0, "failed": 0, "output": "No source files or test files were generated."}
    try:
        with tempfile.TemporaryDirectory(prefix="devteam_") as temp:
            base = Path(temp).resolve()
            for item in all_files:
                rel = Path(item.get("path", ""))
                if rel.is_absolute() or ".." in rel.parts or rel.suffix != ".py":
                    raise ValueError(f"Unsafe generated path: {rel}")
                target = (base / rel).resolve()
                if base not in target.parents:
                    raise ValueError("Generated file path escapes the test directory.")
                target.parent.mkdir(parents=True, exist_ok=True)
                source = item.get("content", "")
                _validate_python(source)
                target.write_text(source, encoding="utf-8")
            env = {"PATH": os.environ.get("PATH", ""), "PYTHONIOENCODING": "utf-8"}
            completed = subprocess.run(
                [sys.executable, "-I", "-m", "pytest", "-q", str(base)],
                cwd=base, capture_output=True, text=True, timeout=20,
                env=env, shell=False,
            )
            output = (completed.stdout + "\n" + completed.stderr).strip()[-12000:]
            passed = failed = 0
            for line in output.splitlines():
                if " passed" in line or line.strip().endswith("passed"):
                    try: passed = int(line.strip().split()[0])
                    except (ValueError, IndexError): pass
                if " failed" in line:
                    try: failed = int(line.strip().split()[2])
                    except (ValueError, IndexError): pass
            return {"status": "passed" if completed.returncode == 0 else "failed",
                    "return_code": completed.returncode, "passed": passed,
                    "failed": failed, "output": output}
    except subprocess.TimeoutExpired:
        return {"status": "timeout", "passed": 0, "failed": 0, "output": "Tests exceeded the 20-second limit."}
    except Exception as exc:
        return {"status": "error", "passed": 0, "failed": 0, "output": f"{type(exc).__name__}: {exc}"}
