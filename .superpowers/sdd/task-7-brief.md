### Task 7: Setup Sentry Error & Performance Monitoring

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/sentry.client.config.ts`, `frontend/sentry.server.config.ts`, `frontend/sentry.edge.config.ts`
- Modify: `frontend/next.config.ts`

**Interfaces:**
- Produces: Client, server, and edge configuration entrypoints for Sentry, wrapped within next.config.ts.

- [ ] **Step 1: Install Sentry Next.js SDK**
```bash
cd frontend && pnpm add @sentry/nextjs
```

- [ ] **Step 2: Create Sentry configuration files**
*(Agent instruction: Create `frontend/sentry.client.config.ts`, `frontend/sentry.server.config.ts`, and `frontend/sentry.edge.config.ts` with standard Sentry initialization logic pointing to the Sentry DSN env variable.)*

- [ ] **Step 3: Update next.config.ts to wrap Next config with Sentry**
*(Agent instruction: Update `frontend/next.config.ts` to wrap NextConfig using `withSentryConfig`.)*

- [ ] **Step 4: Commit**
```bash
git add frontend/
git commit -m "chore(frontend): configure manual sentry error tracking and monitoring"
```
