# Phase 1 Modernization Design

## Scope

Dependency and correctness fixes with no behavior changes.

## Part 1: MUI migration

Remove `@material-ui/core` and `@material-ui/icons`. Install `@mui/material` and `@mui/icons-material` (latest stable). `@emotion/react` and `@emotion/styled` are already present and compatible.

Replace import paths across all 21 affected files:

| Old | New |
|-----|-----|
| `"@material-ui/core"` | `"@mui/material"` |
| `"@material-ui/core/styles"` | `"@mui/material/styles"` |
| `"@material-ui/core/colors"` | `"@mui/material/colors"` |
| `"@material-ui/core/<Component>"` | `"@mui/material/<Component>"` |
| `"@material-ui/icons/<Icon>"` | `"@mui/icons-material/<Icon>"` |

Verify with `pnpm build` in `web/`.

## Part 2: React Router types

Remove `@types/react-router-dom` from `web/devDependencies`. React Router v7 ships its own types — the v5 types package is a mismatch that silently degrades type safety.

Verify with `pnpm build` in `web/`.

## Part 3: Server env hardening

Two changes in `server/src/server.ts`:

1. Replace `require("dotenv").config()` with `import "dotenv/config"` — consistent with the ESM-style imports already in the file, and guarantees env is loaded before any other code runs.
2. After env load, validate `process.env.PORT`: if missing or empty, log a clear error and call `process.exit(1)`.

## Approach

All three parts done in a single pass (Option A). The MUI v5-beta → v5-stable delta is purely a package rename with no API changes, so a global import-path replacement is safe. Build output confirms correctness.
