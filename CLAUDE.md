# FPL Basket

Follow [AGENTS.md](AGENTS.md) for repository structure, coding conventions, and validation commands. See [README.md](README.md) for setup, deployment, and rollback.

The active application is the root pnpm workspace (`apps/web`, `apps/api`, and `packages/contracts`). The legacy Express/Material UI application has been retired. Fastify serves the SPA and `/api/v1`; `/id/:leagueId` redirects preserve old shared links.
