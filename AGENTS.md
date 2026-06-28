# Architecture System Blueprint
- Framework: Next.js 16 (App Router with Turbopack), React 19, Tailwind CSS.
- Component Engine: `shadcn/ui` base primitives overridden with glassmorphism styling.
- WebGL Layer: Isolated `@react-three/fiber` and `@react-three/drei` canvas layer running behind the DOM.
- UI Animation: `framer-motion` for React nodes, `gsap` + `@studio-freight/lenis` for smooth, scroll-bound 3D transformations.
- Core API: FastAPI (Python) running a LangChain pipeline backed by Gemini 2.5 Flash.

# Base data source
1. Al-Rawi (Heritage & Tourism)
You need rich, historical, and architectural documents that give the AI a lot of narrative depth to work with.

UNESCO World Heritage Nominations: This is the goldmine. Countries must submit massive, 300+ page dossiers to UNESCO to get sites approved. They are packed with maps, history, and raw data.

Search terms: site:unesco.org "Al-Hijr Archaeological Site" filetype:pdf or site:unesco.org "At-Turaif District in ad-Dir'iyah" filetype:pdf

Royal Commission for AlUla (RCU) & DGDA: Both authorities publish massive Masterplan and Sustainability reports.

Where to look: The "Publications" or "Media" sections of the RCU and Diriyah Gate websites. Look for the "Journey Through Time Masterplan" PDF.

King Abdulaziz Foundation for Research and Archives (Darah): They often publish English/Arabic historical journals and research papers on the unification of Saudi Arabia.