# Product Requirements Document (PRD): Al-Rawi (الراوي)

## 1. Vision & Core Mission
**Al-Rawi (الراوي - "The Storyteller")** is an immersive, next-generation web experience designed to bring Saudi Arabia's rich historical, archaeological, and cultural heritage to life. By merging high-fidelity interactive 3D WebGL representations of UNESCO World Heritage Sites (e.g., Hegra in AlUla, At-Turaif in Diriyah) with agentic, bilingual Retrieval-Augmented Generation (RAG) and spatial-narrative audio, Al-Rawi bridges the gap between historical scholarship and modern interactive discovery.

The platform is designed to serve as both an engaging educational portal for global travelers and an authoritative research workspace for academic historians.

---

## 2. Target Personas

### Persona A: The Academic Researcher
* **Linguistic/Interests:** Needs absolute historical accuracy, detailed citations of primary source materials (e.g., UNESCO dossiers, King Abdulaziz Foundation/Darah research papers), and multitemporal/spatial context.
* **UX Needs:** Detailed bibliographies, interactive relation graphs (Entity Mind Maps), multi-spectral visual overlays (e.g., swapping to LiDAR scans to study structural cracks or Infrared to read faded Nabataean rock inscriptions), and direct coordinate mapping.

### Persona B: The Cultural Tourist
* **Linguistic/Interests:** Desires an engaging, narrative-driven exploration. Prefers listening over reading. Interested in regional dialects, colloquial vocabulary, and local folktales.
* **UX Needs:** High-fidelity 3D orbits, intuitive camera controls, real-time voice-activated guide search (Whisper STT), dynamic soundscapes (wind, desert crickets), and clear Arabic Tashkeel (diacritics) for correct pronunciation.

---

## 3. Core Feature Specifications

### A. Cinematic 3D WebGL Canvas
* **Tech Stack:** React Three Fiber (R3F), `@react-three/drei`, WebGL.
* **Mesh Streaming:** Chunked quadtree tile loading with occlusion culling to support low-spec mobile devices without crashing.
* **Visual Modes:** Standard photogrammetry, topological point-cloud LiDAR, and Infrared inscription-reading shaders.
* **Interactions:** Spatial click hotspots that synchronize the Three.js viewport with active RAG chat queries.

### B. Interactive Mind Map Engine
* **Tech Stack:** React Flow.
* **Extraction:** Automated extraction of historical figures, locations, and dynasties from retrieval chunks via FastAPI + Pydantic AI.
* **Syncing:** Clicking a mind map node focuses the 3D camera on its corresponding physical structure in the WebGL viewport.

### C. The Majlis (RAG Audio Guide)
* **Tech Stack:** FastAPI, Gemini 2.5, ElevenLabs, Whisper, Mishkal.
* **Prosody:** Automated Tashkeel parsing (`mishkal`) for flawless classical Arabic TTS vocalization.
* **Voice:** Fully conversational hands-free guide mode with audio-responsive WebGL geometry scaling.

---

## 4. Success Metrics & Performance Targets
1. **WebGL Frame Rate:** Maintain stable $\ge 60$ FPS on modern desktops and $\ge 30$ FPS on low-end mobile devices via progressive auto-degradation.
2. **Retrieval Faithfulness:** RAGAS Faithfulness score $\ge 0.85$ with zero hallucinations of historical facts.
3. **Audio Latency:** TTS streaming start time latency $\le 1.2$ seconds.
4. **Global Performance:** Sub-20ms semantic cache responses globally via replicated Redis edge nodes.
