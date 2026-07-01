from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app.api.v1.documents import is_domain_whitelisted
from app.main import app

client = TestClient(app)


def test_domain_whitelist_matching() -> None:
    """Verify that domain whitelisting correctly accepts approved domains and subdomains."""
    # Whitelisted
    assert is_domain_whitelisted("https://unesco.org/document.pdf") is True
    assert is_domain_whitelisted("https://whc.unesco.org/site.pdf") is True
    assert is_domain_whitelisted("https://historical.sa/doc.pdf") is True
    assert is_domain_whitelisted("https://dgda.gov.sa/masterplan.pdf") is True
    assert is_domain_whitelisted("https://darah.org.sa/journal.pdf") is True
    assert is_domain_whitelisted("https://gutenberg.org/book.pdf") is True
    assert is_domain_whitelisted("https://www.gutenberg.org/book.pdf") is True

    # Off-whitelist
    assert is_domain_whitelisted("https://malicious-site.com/doc.pdf") is False
    assert is_domain_whitelisted("https://unesco.org.attacker.com/doc.pdf") is False
    assert is_domain_whitelisted("https://google.com") is False


@pytest.mark.anyio
@patch("httpx.AsyncClient.head")
async def test_request_document_off_whitelist(mock_head) -> None:
    """Verify that requests to off-whitelist domains are blocked with 400."""
    payload = {"url": "https://malicious-site.com/doc.pdf", "api_key": "mock-key"}
    response = client.post("/api/v1/request-document", json=payload)
    assert response.status_code == 400
    assert "Domain not allowed" in response.json()["detail"]
    mock_head.assert_not_called()


@pytest.mark.anyio
@patch("httpx.AsyncClient.head")
async def test_request_document_invalid_content_type(mock_head) -> None:
    """Verify that non-PDF content types are rejected with 400."""
    # Mock HEAD response yielding text/html
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.headers = {"Content-Type": "text/html"}
    mock_head.return_value = mock_response

    payload = {"url": "https://unesco.org/page.html", "api_key": "mock-key"}
    response = client.post("/api/v1/request-document", json=payload)
    assert response.status_code == 400
    assert "Invalid Content-Type" in response.json()["detail"]


@pytest.mark.anyio
@patch("httpx.AsyncClient.head")
async def test_request_document_file_too_large(mock_head) -> None:
    """Verify that document files exceeding 30MB are rejected with 400."""
    # Mock HEAD response yielding size 35MB
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.headers = {
        "Content-Type": "application/pdf",
        "Content-Length": str(35 * 1024 * 1024),
    }
    mock_head.return_value = mock_response

    payload = {"url": "https://unesco.org/giant_dossier.pdf", "api_key": "mock-key"}
    response = client.post("/api/v1/request-document", json=payload)
    assert response.status_code == 400
    assert "File too large" in response.json()["detail"]


@pytest.mark.anyio
@patch("httpx.AsyncClient.head")
@patch("httpx.AsyncClient.get")
async def test_request_document_success_enqueues_arq(mock_get, mock_head) -> None:
    """Verify that valid requests queue successfully into the arq background worker."""
    # Mock HEAD response yielding valid PDF and small size
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.headers = {
        "Content-Type": "application/pdf",
        "Content-Length": "500000",
    }
    mock_head.return_value = mock_response

    # Mock arq_pool
    mock_job = MagicMock()
    mock_job.job_id = "mock_job_123"
    mock_arq_pool = AsyncMock()
    mock_arq_pool.enqueue_job.return_value = mock_job

    app.state.arq_pool = mock_arq_pool

    try:
        payload = {"url": "https://unesco.org/legit.pdf", "api_key": "mock-key"}
        response = client.post("/api/v1/request-document", json=payload)

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "queued"
        assert data["job_id"] == "mock_job_123"
        mock_arq_pool.enqueue_job.assert_called_once_with(
            "ingest_url_task", "https://unesco.org/legit.pdf", "mock-key"
        )
    finally:
        app.state.arq_pool = None
