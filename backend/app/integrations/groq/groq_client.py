from __future__ import annotations

import base64
import io
import json
import re
from typing import Optional

from groq import Groq

from app.core.config import settings

_client: Optional[Groq] = None


def client() -> Groq:
    global _client
    if _client is None:
        if not settings.groq_api_key:
            raise RuntimeError(
                "GROQ_API_KEY is not set. Add it to backend/.env (see .env.example)."
            )
        _client = Groq(api_key=settings.groq_api_key)
    return _client


def chat_completion(
    messages: list[dict],
    model: Optional[str] = None,
    temperature: float = 0.3,
    max_tokens: int = 2000,
    json_mode: bool = False,
) -> str:
    kwargs = dict(
        model=model or settings.groq_text_model,
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
    )
    if json_mode:
        kwargs["response_format"] = {"type": "json_object"}

    # Try primary model; if fallback is configured and primary fails, use fallback.
    # Also try a third hardcoded model if the second one also rate-limits.
    primary = model or settings.groq_text_model
    fallback = settings.groq_fallback_text_model
    third = "llama-3.1-8b-instant"  # final fallback for rate-limit situations

    tries = [primary]
    if fallback:
        tries.append(fallback)
    tries.append(third)

    last_error = None
    for i, m in enumerate(tries):
        if i > 0:
            kwargs["model"] = m
        try:
            resp = client().chat.completions.create(**kwargs)
            content = resp.choices[0].message.content or ""
            if content.strip():
                return content
        except Exception as e:
            last_error = e
            # Only continue to fallback on rate-limit / overload errors (HTTP 429 / 500)
            err_str = str(e).lower()
            is_retryable = any(kw in err_str for kw in ["429", "rate_limit", "rate limit", "too many", "overloaded", "503", "500", "service unavailable", "temporarily"])
            if i < len(tries) - 1 and is_retryable:
                continue
            # On non-retryable error or last attempt, raise
            if i == len(tries) - 1:
                raise
    if last_error:
        raise last_error
    return ""


def extract_json(text: str) -> dict:
    """Best-effort extraction of a JSON object from an LLM response."""
    text = text.strip()
    text = re.sub(r"^```(json)?", "", text).strip()
    text = re.sub(r"```$", "", text).strip()
    try:
        return json.loads(text)
    except Exception:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except Exception:
                pass
    return {}


def image_to_base64_url(image_bytes: bytes, mime: str = "image/png") -> str:
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    return f"data:{mime};base64,{b64}"


def vision_extract_table_csv(image_bytes: bytes, mime: str = "image/png") -> str:
    """Send an image to a Groq vision model and get back CSV text representing any
    tabular data (rows/columns) found in the image."""
    image_url = image_to_base64_url(image_bytes, mime)
    prompt = (
        "You are given an image that contains tabular data (a table, spreadsheet screenshot, "
        "chart data table, or grid of rows and columns). Extract the data faithfully and return "
        "ONLY valid CSV text (comma-separated, first row = header). Do not include markdown code "
        "fences, explanations, or any text other than the CSV. If numbers use thousands separators "
        "or currency symbols, keep the raw numeric value where possible. If truly no tabular data "
        "exists, infer a reasonable structured table from the key facts/labels visible in the image."
    )
    resp = client().chat.completions.create(
        model=settings.groq_vision_model,
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": image_url}},
                ],
            }
        ],
        temperature=0.1,
        max_tokens=4000,
    )
    content = resp.choices[0].message.content or ""
    content = content.strip()
    content = re.sub(r"^```(csv)?", "", content).strip()
    content = re.sub(r"```$", "", content).strip()
    return content


def transcribe_audio(file_bytes: bytes, filename: str = "audio.webm") -> str:
    buf = io.BytesIO(file_bytes)
    buf.name = filename
    resp = client().audio.transcriptions.create(
        model=settings.groq_whisper_model,
        file=buf,
        response_format="text",
    )
    return resp if isinstance(resp, str) else getattr(resp, "text", str(resp))