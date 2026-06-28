### Task 9: Setup Neon Auth (Google OAuth & Anonymous Sessions)

**Files:**
- Create: `frontend/src/lib/auth/client.ts`
- Create: `frontend/src/lib/auth/server.ts`
- Create: `frontend/src/app/api/auth/[...all]/route.ts`
- Modify: `frontend/.env.local`

**Interfaces:**
- Produces: Seamless authentication powered by Neon Auth (BetterAuth) supporting anonymous sessions that merge into permanent Google OAuth accounts.

- [ ] **Step 1: Install Neon Auth Dependencies**
```bash
cd frontend && pnpm add @neondatabase/auth
```

- [ ] **Step 2: Create the server auth config**
*(Agent instruction: Create `frontend/src/lib/auth/server.ts` using `@neondatabase/auth` with the anonymous plugin and google social provider.)*

- [ ] **Step 3: Create the client auth config**
*(Agent instruction: Create `frontend/src/lib/auth/client.ts` using `@neondatabase/auth/react` (or `@neondatabase/auth/client`) with the anonymousClient plugin.)*

- [ ] **Step 4: Create the catch-all API route**
*(Agent instruction: Create `frontend/src/app/api/auth/[...all]/route.ts` to export GET and POST methods from the server auth handler.)*

- [ ] **Step 5: Add Env Variables**
*(Agent instruction: Ensure `.env.local` expects `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for the OAuth provider.)*

- [ ] **Step 6: Commit**
```bash
git add frontend/
git commit -m "feat(auth): setup neon auth with google oauth and anonymous sessions"
```
