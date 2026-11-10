
import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "").strip()

GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.5-flash-lite"
).strip().lstrip("=").strip()

DATABASE_PATH = os.getenv(
    "DATABASE_PATH",
    "devteam.db"
)

MAX_REQUIREMENT_CHARS = int(
    os.getenv("MAX_REQUIREMENT_CHARS", "6000")
)
