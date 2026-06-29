from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.chat import execute_chat_query

router = APIRouter()


class ChatRequest(BaseModel):
    query: str
    api_key: Optional[str] = None
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    answer: str
    sources: List[Dict[str, Any]]
    model_used: str
    cached: bool


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        result = await execute_chat_query(query=request.query, api_key=request.api_key)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
