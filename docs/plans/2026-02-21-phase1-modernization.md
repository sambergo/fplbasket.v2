# Phase 1 Modernization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix three dependency/correctness issues with no behavior changes: migrate to modern MUI packages, remove mismatched React Router types, and harden server env/port handling.

**Architecture:** All changes are mechanical — package swaps and import-path updates in the frontend, one file change in the server. No API changes, no component logic changes.

**Tech Stack:** pnpm workspaces, React 19 + Vite + TypeScript (web/), Express + TypeScript compiled to CJS (server/), `@mui/material`, `@mui/icons-material`, `dotenv` v16.

---

### Task 1: Swap MUI packages

**Files:**
- Modify: `web/package.json` (via pnpm commands)

**Step 1: Remove old packages**

Run from `web/`:
```bash
cd /home/bergo/repos/fplbasket/web
pnpm remove @material-ui/core @material-ui/icons
```
Expected: both packages removed from `node_modules` and `package.json`.

**Step 2: Install modern MUI packages**

```bash
pnpm add @mui/material @mui/icons-material
```
Expected: `@mui/material` and `@mui/icons-material` appear in `web/package.json` dependencies.

**Step 3: Verify package.json**

Open `web/package.json` and confirm:
- No `@material-ui/*` entries remain
- `@mui/material` and `@mui/icons-material` are present
- `@emotion/react` and `@emotion/styled` are still present (required peers)

---

### Task 2: Update import paths — `@material-ui/core` → `@mui/material`

**Files:**
- Modify: all 21 files listed below (import path replacement only, no logic changes)

The pattern is exact: every occurrence of `@material-ui/core` becomes `@mui/material`. This covers barrel imports, deep imports (`/styles`, `/colors`, `/CssBaseline`, `/Container`, `/IconButton`, `/BottomNavigation`).

**Step 1: Run replacement**

```bash
cd /home/bergo/repos/fplbasket
sed -i 's|@material-ui/core|@mui/material|g' \
  web/src/theme.ts \
  web/src/App.tsx \
  web/src/League.tsx \
  web/src/index.tsx \
  web/src/Landing.tsx \
  web/src/components/Chips.tsx \
  web/src/components/TeamBox.tsx \
  web/src/components/PlayerPage.tsx \
  web/src/components/ChipsUsed.tsx \
  web/src/components/Players.tsx \
  web/src/components/CompareGrid.tsx \
  web/src/components/CardWithTable.tsx \
  web/src/components/CompareManager.tsx \
  web/src/components/Standings.tsx \
  web/src/components/DataPage.tsx \
  web/src/components/NavBar.tsx \
  web/src/components/ShowLiveBonusToggleButton.tsx \
  web/src/components/PointsBox.tsx \
  web/src/components/Captains.tsx \
  web/src/components/Transfers.tsx \
  web/src/components/ManagerPage.tsx
```

**Step 2: Verify no `@material-ui/core` remains**

```bash
grep -r "@material-ui/core" web/src/
```
Expected: no output.

---

### Task 3: Update import paths — `@material-ui/icons` → `@mui/icons-material`

**Files:**
- Modify: `web/src/Landing.tsx`, `web/src/components/Standings.tsx`, `web/src/components/NavBar.tsx`

**Step 1: Run replacement**

```bash
cd /home/bergo/repos/fplbasket
sed -i 's|@material-ui/icons|@mui/icons-material|g' \
  web/src/Landing.tsx \
  web/src/components/Standings.tsx \
  web/src/components/NavBar.tsx
```

**Step 2: Verify no `@material-ui/icons` remains**

```bash
grep -r "@material-ui/icons" web/src/
```
Expected: no output.

**Step 3: Verify no `@material-ui` references remain anywhere**

```bash
grep -r "@material-ui" web/src/
```
Expected: no output.

---

### Task 4: Remove mismatched React Router types

**Files:**
- Modify: `web/package.json` (via pnpm command)

**Step 1: Remove the package**

```bash
cd /home/bergo/repos/fplbasket/web
pnpm remove @types/react-router-dom
```
Expected: `@types/react-router-dom` removed from `package.json` devDependencies.

**Step 2: Verify**

```bash
grep "react-router-dom" web/package.json
```
Expected: only `"react-router-dom": "^7.13.0"` in dependencies — no `@types/` entry.

---

### Task 5: Build web to verify frontend changes

**Step 1: Run TypeScript + Vite build**

```bash
cd /home/bergo/repos/fplbasket/web
pnpm build
```
Expected: exits 0, no TypeScript errors, `dist/` produced.

If errors appear: they will be import-path typos or removed APIs — fix the specific file/line reported, then re-run.

---

### Task 6: Harden server env/port handling

**Files:**
- Modify: `server/src/server.ts`

**Step 1: Read current file**

Open `server/src/server.ts`. Current content:
```typescript
import cors from "cors";
import express from "express";
require("dotenv").config();

const main = async () => {
  const app = express();
  const PORT = process.env.PORT;
  // ...
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at PORT: ${PORT}`);
  });
};
```

**Step 2: Apply changes**

Replace the file content with:
```typescript
import "dotenv/config";
import cors from "cors";
import express from "express";

const PORT = process.env.PORT;
if (!PORT) {
  console.error("Error: PORT environment variable is required but not set.");
  process.exit(1);
}

const main = async () => {
  const app = express();
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static("build"));
  app.use("/id/*", express.static("build"));
  app.use("/api/data", require("./routes/bssData"));
  app.use("/api/league", require("./routes/league"));
  app.use("/api/live", require("./routes/live"));

  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at PORT: ${PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});
```

Changes made:
- `import "dotenv/config"` replaces `require("dotenv").config()` — consistent ESM-style, loads env before anything else
- `PORT` validation moved to module top-level, before `main()` — fails immediately with a clear message if unset

**Step 3: Build server to verify**

```bash
cd /home/bergo/repos/fplbasket/server
pnpm build
```
Expected: exits 0, `dist/` produced, no TypeScript errors.

---

### Task 7: Final full build check

**Step 1: Run the production build script**

```bash
cd /home/bergo/repos/fplbasket
./just-build.sh
```
Expected: both server and web build cleanly, `web/dist` copied to `server/build`.

---

## Done

All three Phase 1 goals complete:
- `@material-ui/*` fully replaced with `@mui/*`
- `@types/react-router-dom` removed
- Server fails fast with a clear message if `PORT` is not set
