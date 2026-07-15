from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.podcast import DialogueLine, PodcastScript

client = TestClient(app)


class MockAgentResult:
    """Mock representing the agent run result containing validated output."""

    def __init__(self, output: PodcastScript):
        self.output = output


@pytest.mark.anyio
@patch("app.services.podcast.podcast_agent.run")
@patch("app.services.podcast.retrieve_rag_context")
@patch("app.services.podcast.GoogleGenerativeAIEmbeddings")
async def test_podcast_draft_endpoint_success(
    mock_embeddings, mock_retrieve, mock_agent_run
) -> None:
    """Verify that drafting a podcast script returns a validated dialogue script structure."""
    # 1. Setup mock retrieved documents
    mock_retrieve.return_value = []

    # 2. Setup mock agent response using actual Pydantic models
    mock_dialogue = [
        DialogueLine(speaker="Visitor", text="What is Hegra?"),
        DialogueLine(
            speaker="Rawi",
            text="Hegra is the first World Heritage site in Saudi Arabia.",
        ),
    ]
    mock_script = PodcastScript(title="Introduction to Hegra", dialogue=mock_dialogue)
    mock_agent_run.return_value = MockAgentResult(mock_script)

    payload = {"query": "Hegra heritage"}
    response = client.post("/api/v1/podcast/draft", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert "title" in data
    assert "dialogue" in data
    assert len(data["dialogue"]) == 2
    assert data["dialogue"][0]["speaker"] == "Visitor"
    assert data["dialogue"][0]["text"] == "What is Hegra?"
    assert data["dialogue"][1]["speaker"] == "Rawi"


@pytest.mark.anyio
@patch("app.services.audio.ElevenLabs")
async def test_audio_stream_endpoint_success(mock_eleven_class) -> None:
    """Verify that the audio streaming endpoint correctly responds with streamed audio bytes."""
    # Mock ElevenLabs generator output
    mock_client = MagicMock()
    mock_eleven_class.return_value = mock_client
    mock_client.generate.return_value = [b"mock", b"audio", b"bytes"]

    payload = {
        "dialogue": [
            {"speaker": "Visitor", "text": "Hello oracle"},
            {"speaker": "Rawi", "text": "مرحباً بك"},
        ],
        "api_key": "dummy_eleven_labs_key",
    }

    response = client.post("/api/v1/audio/stream", json=payload)

    assert response.status_code == 200
    assert response.headers["content-type"] == "audio/mpeg"
    # Assert streamed content matches our mocked bytes
    content = response.content
    assert b"mockaudiobytes" in content
