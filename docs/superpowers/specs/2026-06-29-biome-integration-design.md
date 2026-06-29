# Design Specification: Biome Monorepo Editor & Script Integration

**Date**: 2026-06-29  
**Status**: Approved  

---

## 1. Goal Description

Ensure consistent linting and formatting across the monorepo by integrating Biome into the frontend project's package manager and editor integrations (specifically VS Code/Antigravity IDE).

To achieve this:
1. We will add `@biomejs/biome` as a local devDependency in `frontend/package.json` so that the binary is resolved from local `node_modules` instead of requiring a global CLI installation.
2. We will expose `pnpm run lint` and `pnpm run format` scripts in the frontend package.
3. We will configure the VS Code settings at the workspace root and the frontend folder level to leverage the local Biome package, enabling format-on-save and auto-fixing of diagnostics.

---

## 2. Proposed Changes

### Frontend Package

#### [MODIFY] [package.json](file:///c:/Users/hp/Desktop/gab/git%20projects/Al-Rawi/frontend/package.json)
* Add `@biomejs/biome` to `devDependencies` matching the schema target version (e.g. latest `^1.9.4` or `^1.8.3`).
* Keep/add the scripts:
  * `"lint": "biome lint ."`
  * `"format": "biome format . --write"`

---

### IDE Editor Configurations

#### [NEW] [.vscode/settings.json](file:///c:/Users/hp/Desktop/gab/git%20projects/Al-Rawi/.vscode/settings.json)
* Workspace-level editor configurations to map JS/TS/JSON formatter to `biomejs.biome` and resolve from the local `frontend/node_modules` wrapper binary.

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

#### [NEW] [frontend/.vscode/settings.json](file:///c:/Users/hp/Desktop/gab/git%20projects/Al-Rawi/frontend/.vscode/settings.json)
* Folder-level configurations when the `frontend` folder is opened directly as the workspace root.

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

---

## 3. Verification Plan

### Automated Tests & CLI
1. Run `pnpm install` inside the `frontend` directory.
2. Run `pnpm run lint` and verify it checks code for errors and outputs correctly.
3. Run `pnpm run format` and verify formatting resolves cleanly.

### Editor Verification
1. Ensure the Antigravity IDE loads the workspace configuration and resolves Biome dynamically from local node modules path without using a global installation.
