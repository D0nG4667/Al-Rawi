/brainstorming Let's architect the "Al-Rawi" system using our local MCP context7 and superpowers. Here is our product spec:
You are a world-class creative developer and expert Next.js/FastAPI solutions architect. Build "Al-Rawi" (الراوي), a high-end, award-winning interactive web experience inspired by NotebookLM but executed with the visual fidelity of an Emergent.sh 3D website. 

CRITICAL ARCHITECTURE & STACK (LATEST VERSIONS ONLY):
- UI/UX Layer: Next.js 16 (App Router, Turbopack), latest Tailwind CSS, and shadcn/ui (use as the base for all UI components to ensure accessibility, overriding the default styles with glassmorphism).
- 3D & WebGL Canvas: Latest React Three Fiber (@react-three/fiber) compatible with React 19, @react-three/drei.
- Animation & Physics: Framer Motion (for UI orchestration), GSAP + ScrollTrigger, and @studio-freight/lenis (for smooth scrolling).
- Backend APIs: FastAPI (Python), Gemini 2.5 Flash, LangChain.

VISUAL & 3D ART DIRECTION (The "Emergent" Vibe):
- Background: A deep, rich ambient dark mode (#0B0C10) with animated glowing radial gradients mimicking desert dusk.
- The 3D Canvas: A full-screen, fixed `<Canvas>`. Inside, render a floating, highly detailed 3D artifact (placeholder GLTF of an ancient astrolabe or Najdi pattern). 
- 3D Lighting: `<Environment preset="city" />`, soft `<SpotLight>`, and subtle `<Float>` physics. 
- Scroll: GSAP animates the 3D object's rotation and camera zoom based on Lenis scroll position.

UI LAYOUT (shadcn/ui + Glassmorphism):
Apply backdrop-blur and 1px translucent white borders to shadcn/ui components (Cards, Dialogs, Sidebars).

1. Floating Header:
   - Logo: "Al-Rawi | الراوي".
   - Right: A shadcn input for the Gemini API Key. Use a Framer Motion glowing dot indicator (neon green when connected).
2. Left Panel (Archive Ingestion):
   - A frosted-glass shadcn sidebar.
   - Drag-and-drop PDF upload zone (Max 5).
   - shadcn input for "Add Direct Link".
   - Animated list of documents.
3. Center Stage:
   - Floating 3D artifact when idle.
   - Action Button (shadcn primary): "Generate Al-Rawi Mind Map". Spawns an interactive React Flow canvas with custom glowing nodes.
4. Right Panel (Agentic Chatbot):
   - A floating shadcn chat interface (Gemini 2.5 Flash).
   - Agentic Behavior: Strictly grounded RAG for document queries. Citations render as glowing shadcn Badges that auto-scroll the document.

THE AUDIO OVERVIEW "MAJLIS":
- Action Button: "Summon the Majlis (Audio Overview)". Hovering triggers particle effects in the 3D canvas.
- Backend logic: FastAPI prompts Gemini for a two-persona storytelling script (Curious Visitor & Al-Rawi).
- Audio Sync: The 3D artifact pulses dynamically to the audio frequencies while playing.

CODE GENERATION RULES:
- Output modular Next.js 16 Server and Client components.
- Isolate the 3D `<Canvas>` layer from the React DOM to maintain 60+ FPS.
Review our local AGENTS.md file and outline our structural implementation strategy.