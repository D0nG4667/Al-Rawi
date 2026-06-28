import json
import os
import sqlite3
import sys
from pathlib import Path

# Add backend directory to path to import services
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BACKEND_DIR))

from app.services.security import (  # noqa: E402
    compute_sha256_hash,
    generate_file_signature,
)

# Define paths
DATA_DIR = BACKEND_DIR / "data"
PROCESSED_DIR = DATA_DIR / "processed"
DB_PATH = PROCESSED_DIR / "audit_log.db"
JSON_OUTPUT = PROCESSED_DIR / "3d_assets.json"

PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

# Secret key for signature checks
SECRET_KEY = os.getenv("SECRET_KEY", "al_rawi_dev_secret_key_change_in_prod")

# Sample 3D assets linked to heritage structures with geo points
ASSETS_SEED = [
    {
        "id": "asset_hegra_lihyan_tomb",
        "name": "Tomb of Lihyan son of Kuza (Hegra)",
        "type": "glb",
        "site_id": "hegra",
        "primary_url": "https://assets.alrawi.org/models/hegra_lihyan.glb",
        "ipfs_cid": "QmXoyp1eg2EK7M3YdMry3tDxL6g47Jm68jY5JSwEmaFjh1",
        "arweave_tx_id": "ar_tx_hegra_lihyan_tomb_model_001",
        "coordinates": [37.915, 26.801],
        "description": "High-fidelity photogrammetry model of the iconic monolithic Nabataean tomb facade.",
    },
    {
        "id": "asset_diriyah_salwa_palace",
        "name": "Salwa Palace facade (At-Turaif)",
        "type": "glb",
        "site_id": "diriyah",
        "primary_url": "https://assets.alrawi.org/models/salwa_palace.glb",
        "ipfs_cid": "QmZ8xP2r3YdMry3tDxL6g47Jm68jY5JSwEmaFjh2Xoyp2",
        "arweave_tx_id": "ar_tx_diriyah_salwa_palace_model_002",
        "coordinates": [46.574, 24.735],
        "description": "3D reconstruction of the Salwa Palace courtyard Najdi mud-brick columns.",
    },
    {
        "id": "asset_jeddah_nassif_house",
        "name": "Nassif House wooden rawashin (Jeddah)",
        "type": "glb",
        "site_id": "jeddah",
        "primary_url": "https://assets.alrawi.org/models/nassif_rawashin.glb",
        "ipfs_cid": "QmY5JSwEmaFjh3Xoyp3eg2EK7M3YdMry3tDxL6g47Jm68j",
        "arweave_tx_id": "ar_tx_jeddah_nassif_house_model_003",
        "coordinates": [39.186, 21.484],
        "description": "Detailed architectural asset showing projection wooden windows of Al-Balad.",
    },
]


def init_audit_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS audit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT NOT NULL,
            entity_type TEXT NOT NULL,
            entity_id TEXT NOT NULL,
            details TEXT,
            signature TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


def log_audit_entry(action: str, entity_type: str, entity_id: str, details: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Generate cryptographic signature for the audit entry content
    content = f"{action}:{entity_type}:{entity_id}:{details}"
    sig = generate_file_signature(content.encode("utf-8"), SECRET_KEY)

    cursor.execute(
        "INSERT INTO audit_log (action, entity_type, entity_id, details, signature) VALUES (?, ?, ?, ?, ?)",
        (action, entity_type, entity_id, details, sig),
    )
    conn.commit()
    conn.close()


def main():
    init_audit_db()

    print("[+] Seeding 3D assets and generating integrity signatures...")
    processed_assets = []

    for asset in ASSETS_SEED:
        # Create a deterministic serialization to generate signatures
        asset_str = json.dumps(asset, sort_keys=True)
        # Compute SHA-256 integrity hash
        integrity_hash = compute_sha256_hash(asset_str)
        # Sign the asset definition to verify authentic source seeding
        signature = generate_file_signature(asset_str.encode("utf-8"), SECRET_KEY)

        # Append metadata
        asset_meta = asset.copy()
        asset_meta["integrity_hash"] = integrity_hash
        asset_meta["source_signature"] = signature
        processed_assets.append(asset_meta)

        # Log to secure audit trail
        log_audit_entry(
            action="SEED_3D_ASSET",
            entity_type="3D_MODEL",
            entity_id=asset["id"],
            details=f"Seeded 3D asset metadata with hash {integrity_hash[:10]}...",
        )
        print(f"[OK] Seeded and signed {asset['id']}")

    # Write metadata index to JSON
    with open(JSON_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(processed_assets, f, indent=2, ensure_ascii=False)

    print(f"[OK] Saved final seeded assets to {JSON_OUTPUT}")
    print("[OK] Audit log database initialized and records committed.")


if __name__ == "__main__":
    main()
