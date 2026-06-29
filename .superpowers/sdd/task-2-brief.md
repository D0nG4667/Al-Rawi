### Task 2: Configure Workspace Root IDE Editor Settings

**Files:**
- Create: `.vscode/settings.json`

**Interfaces:**
- Consumes: `@biomejs/biome` inside `frontend/node_modules`.
- Produces: Workspace-level formatting and auto-fixing configuration.

- [ ] **Step 1: Create workspace-level settings file**

Create the file `.vscode/settings.json` at the root of the workspace.

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports.biome": "explicit",
    "source.fixAll.biome": "explicit"
  },
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "biome.lsp.bin": "${workspaceFolder}/frontend/node_modules/@biomejs/biome/bin/biome"
}
```

- [ ] **Step 2: Commit settings**

Run:
```bash
git add .vscode/settings.json
git commit -m "chore: add workspace-level VS Code settings for Biome integration"
```

---

