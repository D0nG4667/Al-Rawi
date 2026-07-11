from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.mindmap import Edge, MindMapGraph, Node, NodeData, Position

client = TestClient(app)


class MockAgentResult:
    """Mock representing the agent run result containing validated output."""

    def __init__(self, output: MindMapGraph):
        self.output = output


@pytest.mark.anyio
@patch("app.services.mindmap.mindmap_agent.run")
@patch("app.services.mindmap.retrieve_rag_context")
@patch("app.services.mindmap.GoogleGenerativeAIEmbeddings")
async def test_mindmap_endpoint_success(
    mock_embeddings, mock_retrieve, mock_agent_run
) -> None:
    """Verify that generating a mindmap returns a validated structure of nodes and edges."""
    # 1. Setup mock retrieved documents
    mock_retrieve.return_value = []

    # 2. Setup mock agent response using actual Pydantic models
    mock_nodes = [
        Node(
            id="n1",
            data=NodeData(label="Hegra"),
            position=Position(x=10.0, y=-20.0),
        ),
        Node(
            id="n2",
            data=NodeData(label="Nabataeans"),
            position=Position(x=120.0, y=50.0),
        ),
    ]
    mock_edges = [Edge(id="e1-2", source="n1", target="n2", label="Built by")]
    mock_graph = MindMapGraph(nodes=mock_nodes, edges=mock_edges)
    mock_agent_run.return_value = MockAgentResult(mock_graph)

    payload = {"query": "Hegra history"}
    response = client.post("/api/v1/mindmap", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "edges" in data
    assert len(data["nodes"]) == 2
    assert data["nodes"][0]["id"] == "n1"
    assert data["nodes"][0]["data"]["label"] == "Hegra"
    assert data["nodes"][0]["position"]["x"] == 10.0
    assert data["nodes"][0]["position"]["y"] == -20.0
    assert data["edges"][0]["source"] == "n1"
    assert data["edges"][0]["target"] == "n2"
    assert data["edges"][0]["label"] == "Built by"


@pytest.mark.anyio
@patch("app.services.mindmap.mindmap_agent.run")
@patch("app.services.mindmap.retrieve_rag_context")
@patch("app.services.mindmap.GoogleGenerativeAIEmbeddings")
async def test_mindmap_endpoint_layout_fallback(
    mock_embeddings, mock_retrieve, mock_agent_run
) -> None:
    """Verify that if all coordinates are (0,0), a fallback circular layout is applied."""
    mock_retrieve.return_value = []

    # All nodes start at (0,0)
    mock_nodes = [
        Node(id="center", data=NodeData(label="Al-Ula"), position=Position(x=0, y=0)),
        Node(id="n2", data=NodeData(label="Dadan"), position=Position(x=0, y=0)),
        Node(id="n3", data=NodeData(label="Jabal Ikmah"), position=Position(x=0, y=0)),
    ]
    mock_edges = []
    mock_graph = MindMapGraph(nodes=mock_nodes, edges=mock_edges)
    mock_agent_run.return_value = MockAgentResult(mock_graph)

    payload = {"query": "Al-Ula"}
    response = client.post("/api/v1/mindmap", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert len(data["nodes"]) == 3
    # First node remains at center
    assert data["nodes"][0]["position"]["x"] == 0.0
    assert data["nodes"][0]["position"]["y"] == 0.0

    # Outer nodes are placed in circle (e.g. angle spacing)
    assert (
        data["nodes"][1]["position"]["x"] != 0.0
        or data["nodes"][1]["position"]["y"] != 0.0
    )
    assert (
        data["nodes"][2]["position"]["x"] != 0.0
        or data["nodes"][2]["position"]["y"] != 0.0
    )
