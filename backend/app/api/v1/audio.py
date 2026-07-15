from typing import List, Optional

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.core.config import get_settings
from app.services.audio import generate_majlis_audio_stream

router = APIRouter()


class DialogueLine(BaseModel):
    speaker: str
    text: str


class AudioStreamRequest(BaseModel):
    dialogue: List[DialogueLine]
    api_key: Optional[str] = None


@router.post("/audio/stream")
async def audio_stream_endpoint(request: AudioStreamRequest):
    """Streams MP3 voice bytes generated via ElevenLabs (or gTTS fallback) from structured dialog script."""
    try:
        settings = get_settings()
        eleven_key = request.api_key or settings.ELEVEN_API_KEY

        # Map Pydantic models to dict lists
        lines = [line.model_dump() for line in request.dialogue]

        generator = generate_majlis_audio_stream(
            dialogue_lines=lines, eleven_api_key=eleven_key
        )

        return StreamingResponse(generator, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
