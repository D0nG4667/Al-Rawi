# Task 14 Brief: Frontend Core Design Patterns Setup

We need to implement the core React and WebGL design patterns supporting our extensible, 60+ FPS layout. This includes the `ArtifactFactory` component, atomic Zustand state selectors, raycast occlusion validation framework, viseme lip-sync hooks, sky dome environments, WebGL context lost recovery handlers, and more.

## TDD Plan

### Automated Test Cases
1. **Artifact Factory Resolution**: A unit test verifying that passing specific artifact types (e.g., `MINDMAP`, `AUDIO`, `3D_MODEL`, `PDF`) to the `ArtifactFactory` returns the corresponding React nodes correctly without throwing rendering errors.
2. **WebGL Fallback Card Toggle**: Verify that triggering WebGL context loss switches the scene model state to the custom fallback UI notice.

---

## Tasks & Proposed Changes

### [Component Name] Frontend Architecture & Design Patterns

#### [NEW] [ArtifactFactory.tsx](../../frontend/src/components/workspace/ArtifactFactory.tsx)
Factory component utilizing conditional mappings to render various visual panels (mindmaps, audio, 3D hotspots, or PDF viewer widgets) depending on API response types.

#### [MODIFY] [Scene.tsx](../../frontend/src/components/canvas/Scene.tsx)
Integrate WebGL context recovery event listeners (`webglcontextlost` and `webglcontextrestored`) that swap elements with fallback UI warning cards.

#### [NEW] [patterns-check.js](../../frontend/src/tests/patterns-check.js)
Unit test verifying that the `ArtifactFactory` correctly resolves components and handles dynamic element loading.

---

## Verification Plan
- Execute the design patterns unit check.
- Run next-pwa production compilation to confirm TypeScript and WebGL rendering compile cleanly.
