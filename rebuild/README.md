# FPL Basket rebuild

An isolated, current-gameweek-only rebuild of FPL Basket. The legacy `web/` and `server/` applications outside this directory are not used or modified.

## Requirements

- Node.js 22 or newer
- pnpm 10

## Workspace

- `apps/web` — React, Vite, Tailwind, shadcn-style primitives, TanStack Query/Table, and Motion
- `apps/api` — Fastify API, FPL integration, derived live standings, and bounded in-memory caching
- `packages/contracts` — shared Zod schemas and inferred TypeScript types

## Development

```bash
cp .env.example .env
pnpm install
pnpm dev
```

The web app runs at `http://localhost:5173` and proxies API requests to `http://localhost:3637`.

## Validation

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Install Playwright's Chromium runtime once, then run the production smoke tests:

```bash
pnpm exec playwright install chromium
pnpm exec playwright test
```

## Production

```bash
pnpm build
pnpm start
```

Fastify serves both the versioned API and the compiled SPA. Configure production through the variables documented in `.env.example`. The cache is process-local and intentionally clears on restart.

## Current gameweek rule

The API uses the event marked `is_current` by FPL. Before the season begins it falls back to `is_next`. The browser cannot choose or submit a gameweek; prior-event data is fetched internally only where rank and transfer comparisons need it.
