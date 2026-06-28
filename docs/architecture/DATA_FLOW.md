# Data Ingestion & RAG Data Flow

This document details the step-by-step pipeline mapping how raw PDF source dossiers, map boundaries, and 3D ruins are harvested, processed, verified, and indexed within the Al-Rawi system.

## Ingestion Pipeline Flow

```mermaid
sequenceDiagram
    autonumber
    actor Cron as arq Ingestion Trigger
    participant Scraper as Playwright Scraper
    participant Hash as xxhash Checker
    participant Cache as Upstash Redis
    participant Parser as Multimodal Parser (Gemini 2.5)
    participant Arweave as Arweave Ledger
    participant DB as Neon DB (pgvector)
    participant Audit as system_audit_logs

    Cron->>Scraper: Start Ingestion Job
    Scraper->>Scraper: Harvest PDFs (UNESCO/Darah/RCU)
    
    loop Per Document
        Scraper->>Hash: Compute Hash (xxhash64)
        Hash->>Cache: Check if hash exists in Redis cache
        
        alt Hash Exists (Already Processed)
            Cache-->>Scraper: Skip processing
        else Hash Not Found (New Document)
            Cache-->>Scraper: Process Document
            Scraper->>Parser: Extract text, tables, & images
            Parser->>Parser: Generate image descriptions via Gemini 2.5 Flash
            Parser->>Scraper: Return parsed chunks & captions
            
            Scraper->>Scraper: Apply Cryptographic Signature (verify source authority keys)
            Scraper->>Arweave: Permanent cold-storage backup (stores raw PDF/LOD assets)
            Arweave-->>Scraper: Return transaction transaction ID (CID)
            
            Scraper->>DB: Write document chunks with embeddings, spatial coords, & CIDs
            Scraper->>Audit: Write provenance verification result & hash to audit log
        end
    end
```
