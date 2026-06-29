from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient
from langchain_core.documents import Document

from app.main import app
from app.services.ingestion import compute_sha256_hash, process_pdf

client = TestClient(app)


def test_compute_sha256_hash():
    data = b"Al-Rawi Saudi Heritage"
    expected = "ac37c0fa589c1439310fdc90c4e9c366332920f9a9c020e2f07d209aa1ce86d7"
    assert compute_sha256_hash(data) == expected


@patch("app.services.ingestion.upload_to_r2")
@patch("app.services.ingestion.GoogleGenerativeAIEmbeddings")
@patch("app.services.ingestion.PGVector")
@patch("app.services.ingestion.PyPDFLoader")
def test_process_pdf_service(
    mock_loader_cls, mock_pgvector_cls, mock_embeddings_cls, mock_upload_r2
):
    # Mock Document Loader output
    mock_loader = MagicMock()
    mock_loader.load.return_value = [
        Document(page_content="Welcome to Hegra Nabataean Tombs.", metadata={})
    ]
    mock_loader_cls.return_value = mock_loader

    # Mock R2 Uploader
    mock_upload_r2.return_value = "https://mock-r2.com/hegra.pdf"

    # Mock embeddings and PGVector instances
    mock_embeddings = MagicMock()
    mock_embeddings_cls.return_value = mock_embeddings

    mock_pgvector = MagicMock()
    mock_pgvector_cls.return_value = mock_pgvector

    # Process file bytes
    file_bytes = b"mock_pdf_content"
    result = process_pdf(file_bytes, "hegra.pdf", "mock_gemini_key")

    # Assertions
    assert result["filename"] == "hegra.pdf"
    assert result["status"] == "success"
    assert result["chunks"] > 0
    assert result["r2_url"] == "https://mock-r2.com/hegra.pdf"
    mock_pgvector.add_documents.assert_called_once()


@patch("app.api.v1.documents.process_pdf")
def test_upload_endpoint(mock_process_pdf):
    mock_process_pdf.return_value = {
        "filename": "diriyah.pdf",
        "status": "success",
        "chunks": 4,
        "source_hash": "mock_hash",
        "r2_url": "https://mock-r2.com/diriyah.pdf",
    }

    # Post mock pdf to upload route
    files = {"file": ("diriyah.pdf", b"pdf_content_bytes", "application/pdf")}
    data = {"api_key": "mock_gemini_key"}

    response = client.post("/api/v1/upload", files=files, data=data)

    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "success"
    assert json_data["chunks"] == 4
    assert json_data["r2_url"] == "https://mock-r2.com/diriyah.pdf"


def test_upload_endpoint_non_pdf():
    files = {"file": ("diriyah.png", b"png_content_bytes", "image/png")}
    data = {"api_key": "mock_gemini_key"}

    response = client.post("/api/v1/upload", files=files, data=data)
    assert response.status_code == 400
    assert "Only PDF files are supported" in response.json()["detail"]
