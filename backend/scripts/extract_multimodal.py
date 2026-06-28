import json
import os
import re
from io import BytesIO
from pathlib import Path
from typing import Any, Dict, List

import fitz  # PyMuPDF

# Import R2 storage utility
try:
    from app.services.storage import upload_to_r2
except ImportError:
    # Fallback import if not running in module context
    import sys

    sys.path.append(str(Path(__file__).resolve().parent.parent))
    from app.services.storage import upload_to_r2

# Paths
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"
IMAGES_DIR = PROCESSED_DIR / "images"

PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# Regex patterns for spatial/temporal metadata extraction
TEMPORAL_KEYWORDS = [
    r"\d+\s*(?:BCE|CE|BC|AD)",
    r"\d+(?:st|nd|rd|th)\s*century",
    r"Nabatae(?:an|ans)",
    r"dynasty",
    r"reign of",
    r"kingdom of",
    r"First Saudi State",
    r"Ottoman",
]

SPATIAL_KEYWORDS = [
    r"\d+°\s*\d+′\s*\d+″\s*[NESW]",
    r"latitude\s*[:=]\s*\d+\.\d+",
    r"longitude\s*[:=]\s*\d+\.\d+",
    r"coordinate[s]?\s*[:=]\s*[-+]?\d+\.\d+,\s*[-+]?\d+\.\d+",
]


def extract_metadata_from_text(text: str) -> Dict[str, List[str]]:
    metadata = {"temporal": [], "spatial": []}

    # Extract temporal details
    for pattern in TEMPORAL_KEYWORDS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            metadata["temporal"].extend([m.strip() for m in matches])

    # Extract spatial/coordinate details
    for pattern in SPATIAL_KEYWORDS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            metadata["spatial"].extend([m.strip() for m in matches])

    # Deduplicate lists
    metadata["temporal"] = list(set(metadata["temporal"]))
    metadata["spatial"] = list(set(metadata["spatial"]))
    return metadata


def caption_image(image_bytes: bytes) -> str:
    """
    Call Gemini 2.5 Flash to describe the figure.
    Falls back to a structured placeholder if API key is not configured.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "Mock Caption: High-resolution detail of historic masonry, structural ruins, and architectural preservation site."

    try:
        from google import genai
        from PIL import Image

        client = genai.Client(api_key=api_key)
        img = Image.open(BytesIO(image_bytes))
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                img,
                "Describe this historical architectural model, ruin, or monument inscription in detail for a heritage database.",
            ],
        )
        return response.text.strip()
    except Exception as e:
        print(f"[!] Gemini captioning failed, falling back to mock: {e}")
        return "Mock Caption: Historical artifact detailing structural elements and excavation site contours."


def upload_image(image_bytes: bytes, filename: str) -> str:
    """
    Uploads the image to Cloudflare R2 if configured, otherwise saves locally.
    """
    r2_configured = all(
        [
            os.getenv("CLOUDFLARE_R2_ACCOUNT_ID"),
            os.getenv("CLOUDFLARE_R2_ACCESS_KEY_ID"),
            os.getenv("CLOUDFLARE_R2_SECRET_ACCESS_KEY"),
            os.getenv("CLOUDFLARE_R2_BUCKET_NAME"),
        ]
    )

    if r2_configured:
        try:
            file_stream = BytesIO(image_bytes)
            url = upload_to_r2(file_stream, f"processed/images/{filename}")
            return url
        except Exception as e:
            print(f"[!] R2 upload failed, saving locally: {e}")

    # Local fallback save
    local_path = IMAGES_DIR / filename
    with open(local_path, "wb") as f:
        f.write(image_bytes)
    return f"/images/{filename}"


def process_pdf(pdf_path: Path) -> List[Dict[str, Any]]:
    print(f"[+] Processing PDF: {pdf_path.name}")
    chunks = []

    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"[ERR] Failed to open {pdf_path.name}: {e}")
        return chunks

    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()

        # 1. Chunk Text
        page_chunks = [t.strip() for t in text.split("\n\n") if len(t.strip()) > 50]

        # 2. Extract Metadata
        metadata = extract_metadata_from_text(text)

        # 3. Extract Images
        image_list = page.get_images(full=True)
        images = []

        for img_idx, img_info in enumerate(image_list):
            xref = img_info[0]
            try:
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]

                img_name = f"{pdf_path.stem}_p{page_num}_{img_idx}.{image_ext}"

                # Get Caption and URL
                caption = caption_image(image_bytes)
                url = upload_image(image_bytes, img_name)

                images.append({"filename": img_name, "caption": caption, "r2_url": url})
            except Exception as e:
                print(f"[!] Failed to extract image {xref} on page {page_num}: {e}")

        # Append page chunk record
        for idx, chunk_text in enumerate(page_chunks):
            chunks.append(
                {
                    "document_name": pdf_path.name,
                    "page": page_num + 1,
                    "chunk_index": idx,
                    "text": chunk_text,
                    "metadata": metadata,
                    "images": images,
                }
            )

    doc.close()
    return chunks


def main():
    all_chunks = []

    # Process all harvested PDFs
    pdf_dir = RAW_DIR / "unesco"
    if pdf_dir.exists():
        for pdf_file in pdf_dir.glob("*.pdf"):
            all_chunks.extend(process_pdf(pdf_file))

    # Save processed payload JSON
    output_path = PROCESSED_DIR / "chunks.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, indent=2, ensure_ascii=False)

    print(f"[OK] Processed {len(all_chunks)} chunks, saved output to {output_path}")


if __name__ == "__main__":
    main()
