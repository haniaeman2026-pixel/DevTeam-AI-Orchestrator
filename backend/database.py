import json
import sqlite3
from datetime import datetime, timezone
from backend.config import DATABASE_PATH

def _connect():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection

def init_db():
    with _connect() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                requirement TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL,
                result_json TEXT NOT NULL
            )
        """)

def save_project(result: dict):
    with _connect() as conn:
        conn.execute(
            """INSERT OR REPLACE INTO projects
            (id, title, requirement, status, created_at, result_json)
            VALUES (?, ?, ?, ?, ?, ?)""",
            (
                result["project_id"], result.get("title", "Untitled project"),
                result["requirement"], result.get("status", "completed"),
                result.get("created_at", datetime.now(timezone.utc).isoformat()),
                json.dumps(result),
            ),
        )

def list_projects():
    with _connect() as conn:
        rows = conn.execute(
            "SELECT id, title, requirement, status, created_at FROM projects ORDER BY created_at DESC"
        ).fetchall()
    return [dict(row) for row in rows]

def get_project(project_id: str):
    with _connect() as conn:
        row = conn.execute("SELECT result_json FROM projects WHERE id = ?", (project_id,)).fetchone()
    return json.loads(row["result_json"]) if row else None
