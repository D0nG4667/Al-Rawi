import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient
from langchain_core.documents import Document

from app.main import app
from app.services.chat import (
    compress_retrieved_documents,
    execute_chat_query,
    get_resilient_fallback_answer,
)


@pytest.fixture
def client():
    return TestClient(app)


def test_context_compression():
    """Verify that compress_retrieved_documents deduplicates redundant snippets."""
    docs = [
        Document(page_content="Diriyah is a historic town in Saudi Arabia."),
        Document(
            page_content="Diriyah is a historic town in Saudi Arabia."
        ),  # Duplicate
        Document(page_content="Hegra is Al-Hijr archaeological site in AlUla."),
    ]
    compressed = compress_retrieved_documents(docs)
    assert "Diriyah" in compressed
    assert "Hegra" in compressed
    # The duplicate should be pruned
    assert compressed.count("Diriyah is a historic town in Saudi Arabia.") == 1


@pytest.mark.anyio
@patch("app.main.redis_client")
async def test_semantic_cache_hit(mock_redis):
    """Verify that matching cached queries bypass retrievals and LLM invocations."""
    cached_payload = {
        "answer": "At-Turaif is located in Diriyah.",
        "sources": [],
        "model_used": "Cache",
        "cached": True,
    }
    # Mock redis get to return the cached JSON string
    mock_redis.get = AsyncMock(return_value=json.dumps(cached_payload))

    # Invoke query
    result = await execute_chat_query(query="Where is At-Turaif?")

    assert result["cached"] is True
    assert result["answer"] == "At-Turaif is located in Diriyah."
    mock_redis.get.assert_called_once()


@pytest.mark.anyio
@patch("app.services.chat.get_settings")
@patch("app.main.redis_client")
@patch("app.services.chat.retrieve_rag_context")
@patch("langchain_google_genai.ChatGoogleGenerativeAI")
@patch("langchain_openai.ChatOpenAI")
async def test_llm_resilient_failover(
    mock_openai_class,
    mock_gemini_class,
    mock_retrieve,
    mock_redis,
    mock_settings,
):
    """Verify that Gemini model failures gracefully route queries to OpenAI failover."""
    # Setup mocks
    mock_settings.return_value.DATABASE_URL = "postgresql://localhost/mock"
    mock_settings.return_value.GOOGLE_API_KEY = "mock-google-key"
    mock_settings.return_value.OPENAI_API_KEY = "mock-openai-key"

    mock_redis.get = AsyncMock(return_value=None)
    mock_redis.set = AsyncMock()

    # Database returns mock document
    mock_retrieve.return_value = [
        Document(page_content="At-Turaif was the first capital of Saudi Dynasty.")
    ]

    # Primary Gemini fails
    mock_gemini_instance = MagicMock()
    mock_gemini_instance.ainvoke = AsyncMock(side_effect=Exception("Gemini Rate Limit"))
    mock_gemini_class.return_value = mock_gemini_instance

    # Fallover OpenAI succeeds
    mock_openai_instance = MagicMock()
    mock_openai_response = MagicMock()
    mock_openai_response.content = "OpenAI response about At-Turaif."
    mock_openai_instance.ainvoke = AsyncMock(return_value=mock_openai_response)
    mock_openai_class.return_value = mock_openai_instance

    result = await execute_chat_query(query="Explain At-Turaif history")

    assert result["model_used"] == "GPT-4o Mini (Failover)"
    assert result["answer"] == "OpenAI response about At-Turaif."


@pytest.mark.anyio
@patch("app.services.chat.get_settings")
@patch("app.main.redis_client")
@patch("app.services.chat.retrieve_rag_context")
@patch("langchain_google_genai.ChatGoogleGenerativeAI")
async def test_complete_failover_fallback(
    mock_gemini_class, mock_retrieve, mock_redis, mock_settings
):
    """Verify that if all LLM options fail, the chat service returns a resilient fallback message."""
    mock_settings.return_value.DATABASE_URL = "postgresql://localhost/mock"
    mock_settings.return_value.GOOGLE_API_KEY = "mock-google-key"
    mock_settings.return_value.OPENAI_API_KEY = None  # No OpenAI config

    mock_redis.get = AsyncMock(return_value=None)
    mock_redis.set = AsyncMock()
    mock_retrieve.return_value = []

    # Gemini throws error
    mock_gemini_instance = MagicMock()
    mock_gemini_instance.ainvoke = AsyncMock(side_effect=Exception("API Error"))
    mock_gemini_class.return_value = mock_gemini_instance

    result = await execute_chat_query(query="Hegra details")

    assert result["model_used"] == "Resilience Engine"
    assert result["answer"] == get_resilient_fallback_answer("Hegra details")


@patch("app.api.v1.chat.execute_chat_query")
def test_chat_route_endpoint(mock_execute_query, client):
    """Verify that POST /api/v1/chat executes correctly and handles inputs."""
    mock_response = {
        "answer": "Test answer.",
        "sources": [],
        "model_used": "Gemini 2.5 Flash",
        "cached": False,
    }
    mock_execute_query.return_value = mock_response

    payload = {"query": "Tell me about Diriyah", "api_key": "mock-key"}
    response = client.post("/api/v1/chat", json=payload)

    assert response.status_code == 200
    json_data = response.json()
    assert json_data["answer"] == "Test answer."
    assert json_data["model_used"] == "Gemini 2.5 Flash"
    assert json_data["cached"] is False
