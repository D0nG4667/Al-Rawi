### Task 3: Configure Frontend Folder IDE Editor Settings

**Files:**
- Create: `frontend/.vscode/settings.json`

**Interfaces:**
- Consumes: `@biomejs/biome` inside `frontend/node_modules`.
- Produces: Folder-level formatting and auto-fixing configuration when opened directly.

- [ ] **Step 1: Create folder-level settings file**

Create the file `frontend/.vscode/settings.json` inside the frontend directory.

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
  "biome.lsp.bin": "${workspaceFolder}/node_modules/@biomejs/biome/bin/biome"
}
```

- [ ] **Step 2: Commit settings**

Run:
```bash
git add frontend/.vscode/settings.json
git commit -m "chore: add frontend-folder VS Code settings for Biome integration"
```
