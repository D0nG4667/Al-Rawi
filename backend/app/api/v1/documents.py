import os
import re
import urllib.parse
from typing import Any, Dict, Optional, Tuple

import httpx
from fastapi import (
    APIRouter,
    BackgroundTasks,
    File,
    Form,
    HTTPException,
    Request,
    UploadFile,
)
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel

from app.core.config import get_settings
from app.services.ingestion import process_pdf

router = APIRouter()


class DocumentRequest(BaseModel):
    url: str
    api_key: Optional[str] = None


WHITELISTED_DOMAINS = [
    r"^([^.]+\.)*unesco\.org$",
    r"^([^.]+\.)*sa$",
    r"^([^.]+\.)*gov\.sa$",
    r"^([^.]+\.)*org\.sa$",
    r"^([^.]+\.)*gutenberg\.org$",
]


def is_domain_whitelisted(url: str) -> bool:
    """Verifies that the URL's hostname is in the approved whitelist."""
    try:
        parsed = urllib.parse.urlparse(url)
        hostname = parsed.hostname
        if not hostname:
            return False
        hostname = hostname.lower()
        for pattern in WHITELISTED_DOMAINS:
            if re.match(pattern, hostname):
                return True
    except Exception:
        return False
    return False


async def verify_url_headers(url: str) -> Tuple[bool, str]:
    """Performs HEAD request to check content type is PDF and size is < 30MB."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            headers = {"User-Agent": "Al-Rawi-Bot/0.1.0"}
            response = await client.head(url, headers=headers, follow_redirects=True)

            if response.status_code in (405, 501):
                response = await client.get(
                    url, headers=headers, follow_redirects=True, timeout=5.0
                )

            response.raise_for_status()

            # Content-Type check
            content_type = response.headers.get("Content-Type", "")
            if "application/pdf" not in content_type.lower():
                return (
                    False,
                    f"Invalid Content-Type: expected application/pdf, got {content_type}",
                )

            # Content-Length check
            content_length_str = response.headers.get("Content-Length")
            if content_length_str:
                try:
                    content_length = int(content_length_str)
                    if content_length > 30 * 1024 * 1024:
                        return (
                            False,
                            f"File too large: {content_length} bytes (max 30MB)",
                        )
                except ValueError:
                    pass
    except Exception as e:
        return False, f"HTTP verification failed: {e}"

    return True, ""


async def ingest_url_fallback(url: str, api_key: str) -> None:
    """Fallback ingestion runner using FastAPI background tasks thread."""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            headers = {"User-Agent": "Al-Rawi-Bot/0.1.0"}
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            file_bytes = response.content

        parsed = urllib.parse.urlparse(url)
        filename = os.path.basename(parsed.path)
        if not filename or not filename.endswith(".pdf"):
            filename = "downloaded_document.pdf"

        await run_in_threadpool(process_pdf, file_bytes, filename, api_key)
    except Exception as e:
        print(f"[-] Fallback background ingestion failed: {e}")


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...), api_key: Optional[str] = Form(None)
) -> Dict[str, Any]:
    if not file.filename or not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    resolved_key = api_key or get_settings().GOOGLE_API_KEY
    if not resolved_key:
        raise HTTPException(status_code=400, detail="API key is required")

    try:
        contents = await file.read()
        result = await run_in_threadpool(
            process_pdf, contents, file.filename, resolved_key
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/request-document")
async def request_document(
    request_data: DocumentRequest,
    request: Request,
    background_tasks: BackgroundTasks,
) -> Dict[str, Any]:
    url = request_data.url.strip()
    api_key = (
        request_data.api_key
        or request.headers.get("x-api-key")
        or get_settings().GOOGLE_API_KEY
    )
    if not api_key:
        raise HTTPException(status_code=400, detail="API key is required")

    # 1. Domain Whitelisting check
    if not is_domain_whitelisted(url):
        raise HTTPException(
            status_code=400,
            detail="Domain not allowed. Whitelisted domains: unesco.org, gutenberg.org, .sa, .gov.sa, .org.sa",
        )

    # 2. HTTP HEAD Verification
    is_valid_headers, err_msg = await verify_url_headers(url)
    if not is_valid_headers:
        raise HTTPException(status_code=400, detail=err_msg)

    # 3. Queue job in arq
    arq_pool = getattr(request.app.state, "arq_pool", None)
    if arq_pool:
        try:
            job = await arq_pool.enqueue_job("ingest_url_task", url, api_key)
            return {
                "status": "queued",
                "job_id": job.job_id,
                "message": "Document ingestion has been queued in arq background worker.",
            }
        except Exception as e_queue:
            print(
                f"[-] arq queuing failed: {e_queue}. Falling back to background tasks..."
            )

    # Fallback to FastAPI BackgroundTasks
    background_tasks.add_task(ingest_url_fallback, url, api_key)
    return {
        "status": "queued",
        "job_id": "fallback_bg_task",
        "message": "Document ingestion has been queued in local background thread pool.",
    }
