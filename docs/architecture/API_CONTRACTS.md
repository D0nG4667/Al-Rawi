# Frontend-to-Backend API Contracts

This specification defines the JSON payloads, schemas, and routing contracts between the Next.js frontend and the FastAPI backend.

---

## 1. Document Ingestion
* **Endpoint:** `POST /api/upload`
* **Content-Type:** `multipart/form-data`
* **Auth Required:** Yes (Neon Auth admin token)

### Payload Parameters
- `file`: Binary file (PDF, GLTF, OBJ, GeoJSON)
- `tenant_id`: String (e.g. `RCU`, `DGDA`)

### Response (`202 Accepted`)
```json
{
  "document_id": 1042,
  "filename": "hegra_nomination_dossier.pdf",
  "status": "queued",
  "source_hash": "2a3b4c5d6e7f8g9h",
  "arweave_cid": "ar://tx-1234567890abcdef"
}
```

---

## 2. Agentic RAG Chat (Server-Sent Events)
* **Endpoint:** `POST /api/chat`
* **Content-Type:** `application/json`
* **Auth Required:** Optional (Anonymous Session UUID fallback)

### Request Payload
```json
{
  "session_id": "8f8b5d3a-1e9a-4d2c-87c2-f11122233344",
  "message": "Where did the Nabataeans construct the tomb of Lihyan?",
  "persona": "Academic",
  "locale": "en"
}
```

### Stream Event Outputs
FastAPI returns `text/event-stream` returning data chunks in three block types:
1. `[REASONING]`: Tokens detailing the model's query de-biasing and search retrieval steps.
2. `[ANSWER]`: Text markdown tokens of the generated response.
3. `[METADATA]`: JSON containing source citations, map coordinates (`spatial_coords`), and deep links.

---

## 3. Mind Map Node Graph
* **Endpoint:** `POST /api/mindmap`
* **Content-Type:** `application/json`
* **Auth Required:** No

### Request Payload
```json
{
  "session_id": "8f8b5d3a-1e9a-4d2c-87c2-f11122233344"
}
```

### Response (`200 OK`)
```json
{
  "nodes": [
    { "id": "1", "label": "Tomb of Lihyan", "type": "SITE", "properties": {} },
    { "id": "2", "label": "Hegra", "type": "LOCATION", "properties": {} }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2", "type": "IS_LOCATED_IN", "weight": 1.0 }
  ]
}
```

---

## 4. Whisper STT transcription
* **Endpoint:** `POST /api/whisper/transcribe`
* **Content-Type:** `multipart/form-data`
* **Auth Required:** No

### Request Payload
- `file`: WAV/WebM voice recording chunk.

### Response (`200 OK`)
```json
{
  "text": "Tell me about the inscriptions of Hegra"
}
```

---

## 5. Multimodal Inscription OCR Search
* **Endpoint:** `POST /api/multimodal/search`
* **Content-Type:** `multipart/form-data`
* **Auth Required:** No

### Request Payload
- `file`: Photo capture (JPEG, PNG).
- `tenant_id`: String context.

### Response (`200 OK`)
```json
{
  "ocr_text": "𐢖𐢚𐢛𐢝...",
  "translation": "This is the tomb built by...",
  "historical_context": "Dating to the 1st century BCE, built during the reign of King Malichus II...",
  "source_document_citations": ["UNESCO nomination page 122"]
}
```

---

## 6. Offline Local Chat Sync
* **Endpoint:** `POST /api/chat/sync`
* **Content-Type:** `application/json`
* **Auth Required:** Yes

### Request Payload
```json
{
  "chats": [
    {
      "session_id": "offline-session-123",
      "messages": [
        { "role": "user", "content": "What is the size of Hegra?", "timestamp": "2026-06-28T12:00:00Z" }
      ]
    }
  ]
}
```

### Response (`200 OK`)
```json
{
  "synced": true,
  "merged_records": 1
}
```

---

## 7. 3D Interaction Heatmaps
* **Endpoint:** `POST /api/admin/telemetry/heatmap`
* **Content-Type:** `application/json`
* **Auth Required:** No

### Request Payload
```json
{
  "points": [
    { "x": 12.34, "y": 5.67, "z": -8.91, "interaction": "click" }
  ]
}
```

### Response (`200 OK`)
```json
{
  "logged": true
}
```
