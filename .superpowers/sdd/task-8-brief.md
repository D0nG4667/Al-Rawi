### Task 8: Synthetic RAG Evaluation Bootstrapping

**Files:**
- Create: `backend/scripts/generate_synthetic_eval.py`
- Modify: `backend/pyproject.toml` (ensure `ragas` and `pandas` dependencies are added)

**Interfaces:**
- Produces: A generated dataset under `backend/data/eval/synthetic_testset.json` containing 100+ high-quality historical QA evaluations.

- [ ] **Step 1: Write Synthetic QA Dataset Generator with 70/30 Splits**
*(Agent instruction: Create `backend/scripts/generate_synthetic_eval.py`. It must divide our processed text chunks into a **70/30 split** to prevent data leakage.
1. The **70% split** (RAG Ingestion set) is designated for our active pgvector database.
2. The **30% split** (Evaluation set) is kept entirely *out* of pgvector, and is fed into RAGAS or a Gemini 2.5 Pro QA generator to write our 100+ evaluation Q&A pairs (Question, Context, Ground Truth).
This ensures our validation tests reflect real-world generalization performance rather than memorization.)*

- [ ] **Step 2: Execute Generator & Commit**
```bash
cd backend && uv run python scripts/generate_synthetic_eval.py
git add backend/scripts/ backend/data/eval/
git commit -m "test(eval): generate synthetic historical RAGAS testset"
```
