### Task 4b: Global UI State Synchronization (Zustand)

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/src/store/useUIStore.ts`

**Interfaces:**
- Produces: A unified global store syncing the React DOM (Chat and Mind Map) with the 3D Canvas camera target coordinates and focus nodes.

- [ ] **Step 1: Install Zustand**
```bash
cd frontend && pnpm add zustand
```

- [ ] **Step 2: Create the UI Store**
*(Agent instruction: Create `frontend/src/store/useUIStore.ts` exporting a Zustand hook `useUIStore` with properties:
- `activeHistoricalNode: string | null`
- `cameraCoordinates: [number, number, number]`
- `isAIThinking: boolean`
- `setFocusNode: (node: string, coords: [number, number, number]) => void`
)*

- [ ] **Step 3: Commit**
```bash
git add frontend/package.json frontend/pnpm-lock.yaml frontend/src/store/useUIStore.ts
git commit -m "feat(store): configure global zustand store for WebGL and DOM sync"
```
