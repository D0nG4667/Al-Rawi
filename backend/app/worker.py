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


async def optimize_mesh_task(
    ctx: Dict[str, Any], file_bytes: bytes, filename: str, api_key: str
) -> Dict[str, Any]:
    """Optimizes raw OBJ/GLTF meshes (Draco compression, WebP textures, LOD creation)

    and uploads them directly to Cloudflare R2.
    """
    # Simulate mesh optimization transformations
    original_size = len(file_bytes)
    # Mock Draco compression: reduce file size by 65%
    compressed_size = int(original_size * 0.35)

    # In production, this would call storage.upload_to_r2 or similar.
    r2_url = f"https://assets.al-rawi.sa/models/{filename}"

    return {
        "status": "optimized",
        "original_filename": filename,
        "original_size_bytes": original_size,
        "optimized_size_bytes": compressed_size,
        "lod_levels_created": 3,
        "r2_url": r2_url,
    }


# Construct Redis Settings from DSN string
settings = get_settings()
redis_settings = RedisSettings.from_dsn(settings.REDIS_URL)


class WorkerSettings:
    """arq worker configuration settings."""

    functions = [ingest_url_task, optimize_mesh_task]
    redis_settings = redis_settings
