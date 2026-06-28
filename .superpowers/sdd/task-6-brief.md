### Task 6: Add Support/Tip Feature

**Files:**
- Create: `frontend/.env.local`
- Create: `frontend/src/components/ui/SupportButton.tsx`
- Modify: `frontend/src/app/page.tsx`

**Interfaces:**
- Produces: An elegant "Support" button in the UI that reads from `NEXT_PUBLIC_DONATION_LINK`.

- [ ] **Step 1: Create .env.local**
```env
NEXT_PUBLIC_DONATION_LINK=https://sociabuzz.com/gabcares/support
```

- [ ] **Step 2: Create SupportButton.tsx**
*(Agent instruction: Create `frontend/src/components/ui/SupportButton.tsx` using Lucide's Heart icon and the process environment donation link.)*

- [ ] **Step 3: Update page.tsx**
*(Agent instruction: Add `<SupportButton />` inside the main `<main>` wrapper of `page.tsx`)*

- [ ] **Step 4: Commit**
```bash
git add frontend/.env.local frontend/src/components/ui/SupportButton.tsx frontend/src/app/page.tsx
git commit -m "feat(frontend): add environment-driven support/tip button"
```
