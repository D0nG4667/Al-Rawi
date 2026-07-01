from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from langchain_core.documents import Document

from app.services.chat import execute_chat_query, get_tenant_cache_collection


def test_tenant_cache_collection_derivation():
    """Verify distinct API keys map to segregated cache collection names."""
    col_a = get_tenant_cache_collection("key-a")
    col_b = get_tenant_cache_collection("key-b")
    assert col_a.startswith("cache_tenant_")
    assert col_a != col_b


@pytest.mark.anyio
@patch("app.services.chat.check_query_safety")
@patch("app.services.chat.get_settings")
@patch("app.services.chat.PGVector")
@patch("app.services.chat.retrieve_rag_context")
@patch("langchain_google_genai.ChatGoogleGenerativeAI")
async def test_semantic_cache_miss_and_populate(
    mock_gemini, mock_retrieve, mock_vectorstore, mock_settings, mock_safety
):
    """Verify that a cache miss triggers vector search, LLM completion, and cache insert."""
    mock_safety.return_value = (True, "Where is Al-Hijr?")
    mock_settings.return_value.DATABASE_URL = "postgresql://localhost/mock"
    mock_settings.return_value.GOOGLE_API_KEY = "mock-key"

    # Mock cache PGVector instance (miss: similarity_search_with_score returns empty)
    mock_cache_store = MagicMock()
    mock_cache_store.similarity_search_with_score.return_value = []
    mock_vectorstore.return_value = mock_cache_store

    # Mock RAG context
    mock_retrieve.return_value = [Document(page_content="RAG search context data")]

    # Mock LLM response
    mock_llm_instance = MagicMock()
    mock_llm_instance.ainvoke = AsyncMock()
    mock_llm_instance.ainvoke.return_value.content = "Gemini Answer"
    mock_gemini.return_value = mock_llm_instance

    response = await execute_chat_query("Where is Al-Hijr?")

    assert response["answer"] == "Gemini Answer"
    assert response["cached"] is False

    # Check that PGVector.add_documents was called to populate the cache
    mock_cache_store.add_documents.assert_called_once()
    saved_doc = mock_cache_store.add_documents.call_args[0][0][0]
    assert saved_doc.page_content == "Where is Al-Hijr?"
    assert "Gemini Answer" in saved_doc.metadata["response_data"]


@pytest.mark.anyio
@patch("app.services.chat.check_query_safety")
@patch("app.services.chat.get_settings")
@patch("app.services.chat.PGVector")
@patch("app.services.chat.retrieve_rag_context")
@patch("langchain_google_genai.ChatGoogleGenerativeAI")
async def test_semantic_cache_hit(
    mock_gemini, mock_retrieve, mock_vectorstore, mock_settings, mock_safety
):
    """Verify that a similar query (cosine distance <= 0.08) hits the semantic cache."""
    mock_safety.return_value = (True, "Tell me about Al-Hijr")
    mock_settings.return_value.DATABASE_URL = "postgresql://localhost/mock"
    mock_settings.return_value.GOOGLE_API_KEY = "mock-key"

    # Mock cache doc hit (distance 0.04 represents highly similar query)
    mock_doc = Document(
        page_content="Where is Al-Hijr?",
        metadata={"response_data": '{"answer": "Cached Gemini Answer"}'},
    )

    mock_cache_store = MagicMock()
    mock_cache_store.similarity_search_with_score.return_value = [(mock_doc, 0.04)]
    mock_vectorstore.return_value = mock_cache_store

    response = await execute_chat_query("Tell me about Al-Hijr")

    # Verify we got the cached answer and did NOT call database or LLM
    assert response["answer"] == "Cached Gemini Answer"
    assert response["cached"] is True
    mock_retrieve.assert_not_called()
    mock_gemini.assert_not_called()
