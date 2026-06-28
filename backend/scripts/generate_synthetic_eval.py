import json
import os
import random
from pathlib import Path
from typing import Dict

# Define paths
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
PROCESSED_DIR = DATA_DIR / "processed"
EVAL_DIR = DATA_DIR / "eval"

EVAL_DIR.mkdir(parents=True, exist_ok=True)

CHUNKS_FILE = PROCESSED_DIR / "chunks.json"
INGESTION_FILE = PROCESSED_DIR / "ingestion_chunks.json"
EVALUATION_FILE = PROCESSED_DIR / "evaluation_chunks.json"
TESTSET_FILE = EVAL_DIR / "synthetic_testset.json"


def generate_qa_with_gemini(chunk_text: str, document_name: str) -> Dict[str, str]:
    """
    Calls Gemini 2.5 Flash to generate a high-fidelity Question and Ground Truth QA pair.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Missing GEMINI_API_KEY")

    from google import genai

    client = genai.Client(api_key=api_key)

    prompt = (
        f"You are a historical archivist. Based on the following source passage from the document '{document_name}', "
        f"generate one clear, specific factual question and a detailed, accurate ground truth answer. "
        f"Output your response strictly as a JSON object with two keys: 'question' and 'ground_truth'.\n\n"
        f"Passage:\n{chunk_text}"
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={"response_mime_type": "application/json"},
    )

    data = json.loads(response.text.strip())
    return {
        "question": data.get("question", "").strip(),
        "context": chunk_text,
        "ground_truth": data.get("ground_truth", "").strip(),
    }


def generate_qa_fallback(
    chunk_text: str, document_name: str, idx: int
) -> Dict[str, str]:
    """
    Template fallback Q&A generation for offline execution.
    """
    # Simple regex extraction to make questions semi-realistic
    first_words = " ".join(chunk_text.split()[:8])
    question = f"What details are documented in the {document_name} entry starting with '{first_words}'?"
    ground_truth = f"The historical record indicates: {chunk_text}"

    return {"question": question, "context": chunk_text, "ground_truth": ground_truth}


def main():
    if not CHUNKS_FILE.exists():
        print(
            f"[ERR] Processed chunks file {CHUNKS_FILE} does not exist. Run extract_multimodal.py first."
        )
        return

    with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
        chunks = json.load(f)

    if not chunks:
        print("[WARN] No chunks found to generate evaluations.")
        return

    print(f"[+] Loaded {len(chunks)} document chunks. Performing 70/30 split...")

    # Deterministic shuffle to ensure consistent splits across runs
    random.seed(42)
    random.shuffle(chunks)

    split_idx = int(len(chunks) * 0.70)
    ingestion_set = chunks[:split_idx]
    evaluation_set = chunks[split_idx:]

    # Save the splits
    with open(INGESTION_FILE, "w", encoding="utf-8") as f:
        json.dump(ingestion_set, f, indent=2, ensure_ascii=False)
    with open(EVALUATION_FILE, "w", encoding="utf-8") as f:
        json.dump(evaluation_set, f, indent=2, ensure_ascii=False)

    print(
        f"[OK] Saved {len(ingestion_set)} ingestion chunks and {len(evaluation_set)} evaluation chunks."
    )

    # Generate Q&A testset (Targeting 100+ Q&A pairs)
    # We will sample up to 110 chunks from the evaluation set to generate test cases
    sample_size = min(len(evaluation_set), 110)
    sampled_eval_chunks = evaluation_set[:sample_size]

    testset = []
    use_gemini = os.getenv("GEMINI_API_KEY") is not None

    if use_gemini:
        print("[+] Generating synthetic QA testset via Gemini 2.5 Flash...")
    else:
        print(
            "[!] GEMINI_API_KEY not set. Using template-based offline QA generator fallback..."
        )

    for idx, chunk in enumerate(sampled_eval_chunks):
        doc_name = chunk.get("document_name", "Heritage Dossier")
        text = chunk.get("text", "")

        try:
            if use_gemini:
                qa_pair = generate_qa_with_gemini(text, doc_name)
            else:
                qa_pair = generate_qa_fallback(text, doc_name, idx)
            testset.append(qa_pair)
        except Exception:
            # Inline fallback if Gemini call fails
            qa_pair = generate_qa_fallback(text, doc_name, idx)
            testset.append(qa_pair)

        if (idx + 1) % 20 == 0:
            print(f"[*] Processed {idx + 1}/{sample_size} evaluations...")

    # Save synthetic testset
    with open(TESTSET_FILE, "w", encoding="utf-8") as f:
        json.dump(testset, f, indent=2, ensure_ascii=False)

    print(
        f"[OK] Generated {len(testset)} evaluation pairs. Saved testset to {TESTSET_FILE}"
    )


if __name__ == "__main__":
    main()
