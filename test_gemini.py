import asyncio

from backend.config import GEMINI_MODEL
from backend.llm import get_client


async def main():
    print("Testing Gemini model:", GEMINI_MODEL)

    client = get_client()

    response = await client.aio.models.generate_content(
        model=GEMINI_MODEL,
        contents="Reply with exactly: DEVTEAM AI READY",
    )

    print("\nSUCCESS:", response.text)


if __name__ == "__main__":
    asyncio.run(main())
