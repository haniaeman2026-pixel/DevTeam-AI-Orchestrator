
import asyncio
import json
import re

from google import genai
from google.genai import types

from backend.config import GOOGLE_API_KEY, GEMINI_MODEL


_client = None

MAX_ATTEMPTS = 4
RETRY_DELAYS = [2, 4, 8]

RETRYABLE_ERRORS = (
    "503",
    "UNAVAILABLE",
    "429",
    "RESOURCE_EXHAUSTED",
    "500",
    "INTERNAL",
    "504",
    "DEADLINE_EXCEEDED",
)


def get_client():
    global _client

    if not GOOGLE_API_KEY:
        raise RuntimeError(
            "GOOGLE_API_KEY is missing. Add it to backend/.env."
        )

    if _client is None:
        _client = genai.Client(api_key=GOOGLE_API_KEY)

    return _client


def is_retryable_error(error):
    error_text = str(error).upper()
    return any(marker in error_text for marker in RETRYABLE_ERRORS)


async def _generate(
    system_prompt,
    user_prompt,
    temperature=0.2,
    json_mode=False,
):
    client = get_client()

    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
        temperature=temperature,
        max_output_tokens=5000,
        response_mime_type=(
            "application/json" if json_mode else "text/plain"
        ),
    )

    last_error = None

    for attempt in range(MAX_ATTEMPTS):
        try:
            response = await client.aio.models.generate_content(
                model=GEMINI_MODEL,
                contents=user_prompt,
                config=config,
            )

            content = response.text

            if not content:
                raise RuntimeError(
                    "Gemini returned an empty response."
                )

            return content.strip()

        except Exception as error:
            last_error = error

            if not is_retryable_error(error):
                raise

            if attempt == MAX_ATTEMPTS - 1:
                break

            delay = RETRY_DELAYS[attempt]

            print(
                f"[Gemini Retry] Attempt {attempt + 1}/{MAX_ATTEMPTS} "
                f"failed: {error}. Retrying in {delay}s..."
            )

            await asyncio.sleep(delay)

    raise RuntimeError(
        f"Gemini request failed after {MAX_ATTEMPTS} attempts. "
        f"Last error: {last_error}"
    ) from last_error


async def generate_text(
    system_prompt,
    user_prompt,
    temperature=0.2,
):
    return await _generate(
        system_prompt=system_prompt,
        user_prompt=user_prompt,
        temperature=temperature,
        json_mode=False,
    )


def extract_json(content):
    content = content.strip()

    content = re.sub(
        r"^```(?:json)?\s*",
        "",
        content,
        flags=re.IGNORECASE,
    )

    content = re.sub(r"\s*```$", "", content)

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        pass

    start = content.find("{")
    end = content.rfind("}")

    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(content[start:end + 1])
        except json.JSONDecodeError as error:
            raise ValueError(
                f"Gemini returned invalid JSON: {error}"
            ) from error

    raise ValueError("Gemini response does not contain valid JSON.")


async def generate_json(
    system_prompt,
    user_prompt,
    temperature=0.2,
):
    content = await _generate(
        system_prompt=system_prompt,
        user_prompt=user_prompt,
        temperature=temperature,
        json_mode=True,
    )

    return extract_json(content)
