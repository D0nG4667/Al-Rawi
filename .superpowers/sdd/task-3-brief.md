### Task 3: Setup Global Styles & Glassmorphism Theme

**Files:**
- Modify: `frontend/src/app/globals.css`

**Interfaces:**
- Produces: CSS rules mapping `--background` to `#0B0C10` (ambient dark) and setting up `.glass-panel` utilities.

- [ ] **Step 1: Update globals.css to use #0B0C10 background and glassmorphism rules**
*(Agent instruction: Update `frontend/src/app/globals.css` with the Tailwind v4 compatible structure:
1. Define `--background` to `220 18% 5%` and `--foreground` to `210 40% 98%`.
2. Configure `@theme inline` mapping `--color-background` and `--color-foreground` using `hsl()`.
3. Apply background/color styles to body, along with overflow-x hidden.
4. Implement `.glass-panel` styling with backdrop-blur.)*

- [ ] **Step 2: Commit**
```bash
git add frontend/src/app/globals.css
git commit -m "style: configure global dark theme and glassmorphism"
```
