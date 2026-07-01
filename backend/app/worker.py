import os
import urllib.parse
from typing import Any, Dict

import httpx
from arq.connections import RedisSettings
from fastapi.concurrency import run_in_threadpool

from app.core.config import get_settings
from app.services.ingestion import process_pdf


async def ingest_url_task(
    ctx: Dict[str, Any], url: str, api_key: str
) -> Dict[str, Any]:
    """Downloads a PDF from a whitelisted URL and triggers document ingestion."""
    # 1. Download document bytes
    async with httpx.AsyncClient(timeout=30.0) as client:
        headers = {"User-Agent": "Al-Rawi-Bot/0.1.0"}
        response = await client.get(url, headers=headers)
        response.raise_for_status()
        file_bytes = response.content

    # 2. Derive filename from URL path
    parsed = urllib.parse.urlparse(url)
    filename = os.path.basename(parsed.path)
    if not filename or not filename.endswith(".pdf"):
        filename = "downloaded_document.pdf"

    # 3. Process PDF document using ingestion service (run in threadpool)
    result = await run_in_threadpool(process_pdf, file_bytes, filename, api_key)
    return result


# Construct Redis Settings from DSN string
settings = get_settings()
redis_settings = RedisSettings.from_dsn(settings.REDIS_URL)


class WorkerSettings:
    """arq worker configuration settings."""

    functions = [ingest_url_task]
    redis_settings = redis_settings
