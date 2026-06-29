### Task 1: Add Local Biome Dependency and Scripts

**Files:**
- Modify: `frontend/package.json`

**Interfaces:**
- Produces: Local `@biomejs/biome` installation inside `frontend/node_modules`.

- [ ] **Step 1: Modify package.json to add devDependency**

Modify `frontend/package.json` to include `@biomejs/biome` inside the `devDependencies` block.

```json
	"devDependencies": {
		"@biomejs/biome": "^1.9.4",
		"@commitlint/cli": "^19.0.0",
		"@commitlint/config-conventional": "^19.0.0",
		"@tailwindcss/postcss": "^4",
		"@types/node": "^20",
		"@types/react": "^19",
		"@types/react-dom": "^19",
		"babel-plugin-react-compiler": "1.0.0",
		"eslint": "^9",
		"eslint-config-next": "16.2.9",
		"husky": "^9.0.0",
		"lint-staged": "^15.5.2",
		"tailwindcss": "^4",
		"typescript": "^5"
	}
```

- [ ] **Step 2: Run pnpm install to install dependencies**

Run:
```bash
pnpm --filter al-rawi-frontend install
```
Expected: Installs dependencies successfully, creates `node_modules` structure, and locks version in lockfile.

- [ ] **Step 3: Run Biome linter via pnpm script to verify execution**

Run:
```bash
pnpm --filter al-rawi-frontend run lint
```
Expected: Runs successfully (may show lint warnings or errors, but executes CLI fine).

- [ ] **Step 4: Commit changes**

Run:
```bash
git add frontend/package.json frontend/pnpm-lock.yaml
git commit -m "chore: add @biomejs/biome local devDependency"
```

---

