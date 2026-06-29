import hashlib
import os
from tempfile import NamedTemporaryFile
from typing import Any, Dict, List

from langchain_community.document_loaders import PyPDFLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_postgres.vectorstores import PGVector

from app.core.config import get_settings
from app.services.storage import upload_to_r2

COLLECTION_NAME = "al_rawi_documents"


def compute_sha256_hash(file_bytes: bytes) -> str:
    """Computes the SHA-256 hash of file bytes to prevent duplicate ingestion."""
    return hashlib.sha256(file_bytes).hexdigest()


def extract_chunk_entities(text: str) -> Dict[str, List[str]]:
    """Extracts mock entities from text chunks to load into pgvector JSONB column.

    In production, this would use a Pydantic AI structured LLM call.
    """
    entities: Dict[str, List[str]] = {"sites": [], "dynasties": [], "people": []}
    # Simple regex/keyword matching for demo/speed
    text_lower = text.lower()
    if "diriyah" in text_lower or "turaif" in text_lower:
        entities["sites"].append("At-Turaif")
    if "hegra" in text_lower or "al-hijr" in text_lower:
        entities["sites"].append("Hegra")
    if "saud" in text_lower:
        entities["dynasties"].append("House of Saud")
    return entities


def process_pdf(file_bytes: bytes, filename: str, api_key: str) -> Dict[str, Any]:
    """Processes uploaded PDF document, chunks it semantically, uploads original to R2,

    and saves vector embeddings to Neon Postgres.
    """
    settings = get_settings()
    connection_string = settings.DATABASE_URL
    if not connection_string:
        raise ValueError("DATABASE_URL settings is not configured.")

    # Calculate duplicate check hash
    source_hash = compute_sha256_hash(file_bytes)

    # Write binary to temporary file for LangChain loader
    with NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    try:
        # Load PDF Pages
        loader = PyPDFLoader(tmp_path)
        docs = loader.load()

        # Initialize Embeddings model using the provided API Key
        os.environ["GOOGLE_API_KEY"] = api_key
        embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

        # Try to use experimental Semantic Chunker, fallback to RecursiveCharacterTextSplitter
        try:
            from langchain_experimental.text_splitter import SemanticChunker

            text_splitter = SemanticChunker(embeddings)
        except ImportError:
            from langchain_text_splitters import RecursiveCharacterTextSplitter

            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000, chunk_overlap=100
            )

        splits = text_splitter.split_documents(docs)

        # Upload original PDF to Cloudflare R2
        # Re-seek or pass BytesIO to R2
        import io

        file_like = io.BytesIO(file_bytes)
        r2_url = upload_to_r2(file_like, filename)

        # Enrich chunk metadata with spatial tags, provenance, and entities
        for chunk in splits:
            entities = extract_chunk_entities(chunk.page_content)
            chunk.metadata.update(
                {
                    "spatial_coords": {"x": 0.0, "y": 0.0, "z": 0.0},
                    "camera_target": {"pitch": 0.0, "yaw": 0.0},
                    "source_hash": source_hash,
                    "r2_url": r2_url,
                    "linked_entities": entities,
                }
            )

        # Store in PGVector
        vectorstore = PGVector(
            embeddings=embeddings,
            collection_name=COLLECTION_NAME,
            connection=connection_string,
            use_jsonb=True,
        )

        vectorstore.add_documents(splits)

        return {
            "filename": filename,
            "status": "success",
            "chunks": len(splits),
            "source_hash": source_hash,
            "r2_url": r2_url,
        }
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)
