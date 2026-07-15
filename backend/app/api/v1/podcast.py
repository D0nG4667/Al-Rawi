from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.podcast import generate_podcast_script

router = APIRouter()


class PodcastDraftRequest(BaseModel):
    query: Optional[str] = None
    api_key: Optional[str] = None


class DialogueLine(BaseModel):
    speaker: str
    text: str


class PodcastDraftResponse(BaseModel):
    title: str
    dialogue: List[DialogueLine]


@router.post("/podcast/draft", response_model=PodcastDraftResponse)
async def draft_podcast_endpoint(request: PodcastDraftRequest):
    """Generates an editable dialogue script structure (Visitor vs. Rawi) on a heritage topic."""
    try:
        result = await generate_podcast_script(
            query=request.query, api_key=request.api_key
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
