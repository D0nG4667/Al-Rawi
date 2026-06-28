### Task 8b: Seed 3D Assets and GeoJSON Metadata

**Files:**
- Create: `backend/scripts/seed_assets.py`
- Create: `backend/app/services/security.py` (cryptographic signature verification)

**Interfaces:**
- Produces: `backend/data/processed/3d_assets.json` (seeded links & metadata)
- Produces: `backend/data/processed/audit_log.db` (audit logging)

- [ ] **Step 1: Write Cryptographic Security & Signature Verification**
*(Agent instruction: Create `backend/app/services/security.py` containing SHA-256 signature verification functions to validate file integrity and detect tampers of public assets.)*

- [ ] **Step 2: Write Seeder for 3D Assets, GeoJSON metadata, IPFS/Arweave fallbacks, and Audit Log**
*(Agent instruction: Create `backend/scripts/seed_assets.py` to compile public 3D assets, map them with GeoJSON coordinates, generate cryptographic signatures, initialize an SQLite audit database, write audit trails, and save the metadata index to JSON.)*

- [ ] **Step 3: Execute Seeder & Commit**
```bash
cd backend && uv run python scripts/seed_assets.py
git add backend/app/services/security.py backend/scripts/seed_assets.py
git commit -m "feat(data): seed 3d assets and configure cryptographic verification"
```
