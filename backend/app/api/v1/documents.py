from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool

from app.services.ingestion import process_pdf

router = APIRouter()


@router.post("/upload")
async def upload_document(file: UploadFile = File(...), api_key: str = Form(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    try:
        contents = await file.read()
        result = await run_in_threadpool(process_pdf, contents, file.filename, api_key)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
