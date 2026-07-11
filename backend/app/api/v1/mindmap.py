from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.mindmap import generate_mindmap_graph

router = APIRouter()


class MindmapRequest(BaseModel):
    query: Optional[str] = None
    api_key: Optional[str] = None


class Position(BaseModel):
    x: float
    y: float


class NodeData(BaseModel):
    label: str


class Node(BaseModel):
    id: str
    data: NodeData
    position: Position


class Edge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None


class MindmapResponse(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


@router.post("/mindmap", response_model=MindmapResponse)
async def mindmap_endpoint(request: MindmapRequest):
    """Generates structured mindmap nodes and edges for visual representation."""
    try:
        result = await generate_mindmap_graph(
            query=request.query, api_key=request.api_key
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
