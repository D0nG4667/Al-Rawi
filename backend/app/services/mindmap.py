import math
from typing import Any, Dict, List, Optional

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pydantic import BaseModel, Field
from pydantic_ai import Agent

from app.core.config import get_settings
from app.services.chat import compress_retrieved_documents, retrieve_rag_context
from app.services.ingestion import get_tenant_collection_name


# Pydantic models for structured output validation
class Position(BaseModel):
    x: float = Field(
        description="Visual X coordinate (layout center is 0,0, range -300 to 300)"
    )
    y: float = Field(
        description="Visual Y coordinate (layout center is 0,0, range -300 to 300)"
    )


class NodeData(BaseModel):
    label: str = Field(
        description="The display name of the historical entity (landmark, figure, dynasty, event)"
    )


class Node(BaseModel):
    id: str = Field(description="Unique entity identifier (e.g. 'h1', 'diriyah', 'n1')")
    data: NodeData = Field(description="Metadata for the React Flow node")
    position: Position = Field(default_factory=lambda: Position(x=0, y=0))


class Edge(BaseModel):
    id: str = Field(description="Unique relationship identifier (e.g. 'e1-2')")
    source: str = Field(description="ID of the source node")
    target: str = Field(description="ID of the target node")
    label: str = Field(
        description="Short description of the relationship (e.g. 'Located in', 'Founded by')"
    )


class MindMapGraph(BaseModel):
    nodes: List[Node] = Field(
        description="List of nodes representing historical entities"
    )
    edges: List[Edge] = Field(
        description="List of directed edges representing connections between entities"
    )


# Define the structured agent utilizing Gemini 2.5 Flash
mindmap_agent = Agent(
    "google:gemini-2.5-flash",
    output_type=MindMapGraph,
    system_prompt=(
        "You are an expert knowledge architect and Saudi heritage historian. "
        "Extract the top 8-10 most important historical entities (landmarks, figures, dynasties, events) "
        "from the provided context and determine their relationships. "
        "Spread the nodes out in a 2D circle or tree pattern, with coordinates ranging from -300 to 300, avoiding overlapping."
    ),
)


def layout_fallback_circle(nodes: List[Node]) -> List[Node]:
    """Arranges nodes in a visual circular layout if LLM coordinates are missing or clustered."""
    if not nodes:
        return nodes

    # If all nodes are at (0,0), apply a circle layout
    if all(node.position.x == 0 and node.position.y == 0 for node in nodes):
        center_node = nodes[0]
        center_node.position.x = 0
        center_node.position.y = 0

        outer_nodes = nodes[1:]
        count = len(outer_nodes)
        radius = 200.0

        for i, node in enumerate(outer_nodes):
            angle = (2 * math.pi * i) / count
            node.position.x = round(radius * math.cos(angle), 2)
            node.position.y = round(radius * math.sin(angle), 2)

    return nodes


async def generate_mindmap_graph(
    query: Optional[str] = None, api_key: Optional[str] = None
) -> Dict[str, Any]:
    """Retrieves document chunks matching the query or general overview and extracts structured nodes/edges."""
    settings = get_settings()
    google_key = api_key or settings.GOOGLE_API_KEY

    # 1. Setup Embeddings Model
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004", google_api_key=google_key
    )

    # 2. Retrieve context from tenant collection
    docs = []
    if settings.DATABASE_URL:
        try:
            tenant_collection = get_tenant_collection_name(google_key)
            search_query = (
                query
                or "Saudi Arabia UNESCO world heritage landmarks history architecture"
            )
            docs = await retrieve_rag_context(
                search_query, embeddings, settings.DATABASE_URL, tenant_collection
            )
        except Exception as e:
            print(f"[-] Mindmap vector retrieval failed: {e}")

    context = compress_retrieved_documents(docs)

    # 3. Call Pydantic AI Agent
    try:
        prompt = (
            f"Please generate a mind map graph for the query: '{query or 'General Overview'}'.\n"
            f"Use the following context to extract entities:\n\n{context}"
        )
        result = await mindmap_agent.run(prompt)
        graph_data: MindMapGraph = result.output

        # Apply fallback circle layout if needed
        graph_data.nodes = layout_fallback_circle(graph_data.nodes)

        return graph_data.model_dump()
    except Exception as e_agent:
        print(f"[-] Pydantic AI mindmap generation failed: {e_agent}")
        # Return fallback baseline graph
        fallback_nodes = [
            Node(id="n1", data=NodeData(label="Saudi Heritage")),
            Node(id="n2", data=NodeData(label="Diriyah")),
            Node(id="n3", data=NodeData(label="Al-Ula")),
        ]
        layout_fallback_circle(fallback_nodes)
        return {
            "nodes": [n.model_dump() for n in fallback_nodes],
            "edges": [
                {
                    "id": "e1-2",
                    "source": "n1",
                    "target": "n2",
                    "label": "Heritage Site",
                },
                {
                    "id": "e1-3",
                    "source": "n1",
                    "target": "n3",
                    "label": "Heritage Site",
                },
            ],
        }
