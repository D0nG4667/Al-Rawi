### Task 5: Create the 3D WebGL Canvas Layer (Draco & Progressive LOD)

**Files:**
- Create: `frontend/src/components/canvas/Scene.tsx`
- Modify: `frontend/src/app/page.tsx`

**Interfaces:**
- Produces: A full-screen `<Canvas>` layer rendering low-poly fallbacks and OrbitControls, and a glassmorphism DOM UI layout.

- [ ] **Step 1: Create Scene.tsx**
*(Agent instruction: Create `frontend/src/components/canvas/Scene.tsx` with:
1. Full-screen absolute wrapper with -z-10 and background #0B0C10.
2. A `<Canvas>` component config, OrbitControls auto-rotation, and Environment city preset.
3. A `<Detailed>` Three.js progressive Level of Detail component with distances containing a high-poly Primitive, a mid-poly Box helper, and a low-poly Box fallback.
4. Note: Since we don't have the actual gltf model files on disk yet, the high-poly model primitive should fall back gracefully if useGLTF fails, or render a simple mesh/fallback so the app starts without errors.)*

- [ ] **Step 2: Update page.tsx to contain the Scene and UI shell**
*(Agent instruction: Update `frontend/src/app/page.tsx` to include the `<Scene />` and a z-10 glassmorphism DOM layout with Header, Drag-and-drop aside, Central Mind Map button, and Chat box.)*

- [ ] **Step 3: Commit**
```bash
git add frontend/src/components/canvas/Scene.tsx frontend/src/app/page.tsx
git commit -m "feat(frontend): create full-screen 3D WebGL canvas layer and UI shell"
```
