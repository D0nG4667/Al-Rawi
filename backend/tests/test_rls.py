from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from langchain_core.documents import Document

from app.services.chat import execute_chat_query
from app.services.ingestion import get_tenant_collection_name, process_pdf


def test_tenant_collection_derivation():
    """Verify that different API keys map to unique, consistent, and hashed collection names."""
    key_a = "google-key-tenant-a"
    key_b = "google-key-tenant-b"

    col_a1 = get_tenant_collection_name(key_a)
    col_a2 = get_tenant_collection_name(key_a)
    col_b = get_tenant_collection_name(key_b)

    # Consistent check
    assert col_a1 == col_a2
    # Segregation check
    assert col_a1 != col_b
    # Prefix check
    assert col_a1.startswith("tenant_")


@pytest.mark.anyio
@patch("app.services.ingestion.upload_to_r2")
@patch("app.services.ingestion.PGVector")
@patch("app.services.ingestion.compute_sha256_hash")
@patch("app.services.ingestion.PyPDFLoader")
async def test_ingestion_tenant_isolation(
    mock_pdf_loader, mock_sha, mock_vectorstore, mock_r2
):
    """Verify that ingestion processes direct records to the correct tenant collection."""
    mock_sha.return_value = "mockhash123"
    mock_r2.return_value = "https://r2.example.com/file.pdf"

    # Mock PDF pages loading
    mock_loader_instance = MagicMock()
    mock_loader_instance.load.return_value = [
        Document(page_content="Mock page content", metadata={})
    ]
    mock_pdf_loader.return_value = mock_loader_instance

    # Mock PGVector instance
    mock_store_instance = MagicMock()
    mock_vectorstore.return_value = mock_store_instance

    process_pdf(
        file_bytes=b"pdf_bytes",
        filename="doc.pdf",
        api_key="google-key-tenant-a",
    )

    # Check that PGVector was initialized with Tenant A's collection name
    expected_collection = get_tenant_collection_name("google-key-tenant-a")
    mock_vectorstore.assert_called_once()
    assert mock_vectorstore.call_args[1]["collection_name"] == expected_collection


@pytest.mark.anyio
@patch("app.services.chat.get_settings")
@patch("app.main.redis_client")
@patch("app.services.chat.retrieve_rag_context")
@patch("langchain_google_genai.ChatGoogleGenerativeAI")
async def test_chat_query_tenant_isolation(
    mock_gemini_class, mock_retrieve, mock_redis, mock_settings
):
    """Verify that chat queries target only the collection namespace owned by the current tenant."""
    mock_settings.return_value.DATABASE_URL = "postgresql://localhost/mock"
    mock_settings.return_value.GOOGLE_API_KEY = "mock-global-key"

    mock_redis.get = AsyncMock(return_value=None)
    mock_redis.set = AsyncMock()

    mock_retrieve.return_value = []

    # Mock Gemini response
    mock_gemini_instance = MagicMock()
    mock_gemini_instance.ainvoke = AsyncMock()
    mock_gemini_class.return_value = mock_gemini_instance

    # Query with Tenant B's API key
    tenant_b_key = "google-key-tenant-b"
    await execute_chat_query(query="Tell me about Saudi heritage", api_key=tenant_b_key)

    # Retrieve context must be called with Tenant B's dynamic collection name
    expected_collection = get_tenant_collection_name(tenant_b_key)
    mock_retrieve.assert_called_once()
    assert mock_retrieve.call_args[0][3] == expected_collection
