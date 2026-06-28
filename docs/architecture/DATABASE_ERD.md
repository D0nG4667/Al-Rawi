# Database Entity-Relationship Diagram (ERD)

This document contains the Entity-Relationship Diagram (ERD) for the Al-Rawi PostgreSQL database hosted on Neon, detailing our tables, primary/foreign keys, and data types.

## Mermaid ERD Schema

```mermaid
erDiagram
    Users {
        UUID id PK
        VARCHAR email UNIQUE
        VARCHAR role
        VARCHAR tenant_id
        TIMESTAMPTZ created_at
    }

    Documents {
        INT id PK
        VARCHAR filename
        VARCHAR r2_url
        VARCHAR source_hash
        VARCHAR arweave_cid
        VARCHAR cryptographic_signature
        VARCHAR tenant_id
        TIMESTAMPTZ created_at
    }

    DocumentChunks {
        INT id PK
        INT document_id FK
        TEXT page_content
        vector embedding "HNSW Index"
        JSONB spatial_coords "x,y,z coordinates"
        JSONB camera_target "pitch,yaw views"
        JSONB linked_entities "extracted tags"
        VARCHAR tenant_id
    }

    ChatSessions {
        UUID id PK
        UUID user_id FK
        VARCHAR title
        VARCHAR tenant_id
        TIMESTAMPTZ created_at
    }

    ChatMessages {
        INT id PK
        UUID session_id FK
        VARCHAR role
        TEXT content
        TEXT reasoning
        VARCHAR tenant_id
        TIMESTAMPTZ timestamp
    }

    GraphNodes {
        INT id PK
        VARCHAR name UNIQUE
        VARCHAR type
        JSONB properties
        VARCHAR tenant_id
    }

    GraphEdges {
        INT id PK
        INT source_node_id FK
        INT target_node_id FK
        VARCHAR type
        REAL weight
    }

    UnresolvedQueries {
        INT id PK
        TEXT query
        TEXT context
        TEXT generated_response
        VARCHAR status
        VARCHAR tenant_id
        TIMESTAMPTZ created_at
    }

    TouristHeatmap {
        INT id PK
        UUID user_id FK
        JSONB coordinate "3D click coordinates"
        VARCHAR interaction_type "hover/click"
        TIMESTAMPTZ created_at
    }

    %% Relationships
    Users ||--o{ ChatSessions : "creates"
    Documents ||--o{ DocumentChunks : "contains"
    ChatSessions ||--o{ ChatMessages : "contains"
    GraphNodes ||--o{ GraphEdges : "source"
    GraphNodes ||--o{ GraphEdges : "target"
    Users ||--o{ TouristHeatmap : "interacts"
```
