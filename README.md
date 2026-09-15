# FPL Basket

Code for [fplbasket.com](https://fplbasket.com), a current-gameweek Fantasy Premier League mini-league dashboard.

## Workspace

- `apps/web`: React, Vite, Tailwind, TanStack Query/Table, and Motion.
- `apps/api`: Fastify API, FPL integration, and bounded in-memory caching.
- `packages/contracts`: shared Zod schemas and TypeScript types.
- `e2e`: desktop and mobile Playwright smoke tests.

Use Node.js 24 and the exact pnpm version pinned in `package.json` (Corepack selects it automatically). Enable Corepack with `corepack enable` when needed. The lockfile was regenerated during migration to satisfy pnpm’s release-age policy, with Vitest resolved to 5.0.0; no policy exceptions are enabled.

## Development

```sh
cp .env.example .env
pnpm install --frozen-lockfile
pnpm dev
```

The frontend runs at http://localhost:5173 and proxies `/api` to port 3637. The API loads the optional root `.env` from any working directory; existing process environment values take precedence. Keep port 3637 for the default development proxy and browser tests.

```sh
./just-build.sh
pnpm typecheck
pnpm lint
pnpm test
pnpm exec playwright install chromium
pnpm exec playwright test
```

`pnpm start` serves the compiled frontend and `/api/v1` API together. The current event is selected automatically (`is_current`, falling back to `is_next` before the season). The cache is process-local and clears on restart. Existing `/id/<leagueId>` links redirect to `/league/<leagueId>/overview`.

## Production and deployment

`./deploy.sh` builds locally, syncs source to `linode:~/fplbasket`, builds the Docker image remotely, starts the service, and checks `/api/v1/health` before reporting success. Run scripts from any directory. SSH access to `linode`, rsync on both hosts, and Docker Compose on the server are required. Both `docker compose` and the older `docker-compose` command are supported.

Compose preserves container `fplbasket`, service/hostname `server`, port `3636:3636`, restart policy `always`, and the external reverse-proxy network `nginx-proxy-manager_default`. The rebuild does not use MongoDB and no longer requires the legacy `mongo_mongo` network. The existing reverse proxy requires no changes. Docker builds the workspace with its pinned pnpm version and runs the production API as an unprivileged user.

Production defaults work without an environment file. For overrides, create `~/fplbasket/.env` **on the server**, using `.env.production.example` as a reference. Compose reads that file for log level, allowed origins, upstream URL/timeout, and cache size; the container always listens on `0.0.0.0:3636`. Environment files are excluded from both rsync and Docker images, and rsync protects existing remote environment files from deletion. Local development settings are never sent to production.

### First cutover

1. Record the old revision with `git rev-parse HEAD` before committing this migration. Keep the old production environment files for rollback; local copies are preserved in ignored `.migration-backup/` when migrating this checkout.
2. Manually stop the old Compose stack on the server as planned, using its current project directory and Compose command.
3. Run `./deploy.sh` from the migrated checkout. It builds before replacing the service; it does not run `compose down`.
4. Open the site and an existing `/id/<leagueId>` link. Check a league loads live data. The deployment health endpoint checks the app process; it does not establish upstream FPL availability.

Deployment reports failures with container status and the last 100 log lines. The health polling is bounded to 30 attempts with a 3-second request timeout and 2-second delay. Fix the reported problem and rerun the script. No database migration is needed.

### Rollback

Create a separate checkout with `git worktree add /tmp/fplbasket-rollback <old-revision>`. Restore the old untracked environment files to their original `server/` and `web/` paths there from your retained copies. Install dependencies in both old packages, then run its `./just-build.sh`. Do not copy the new Dockerfile or Compose configuration into that checkout.

From the rollback checkout, sync the old source **and build outputs** and recreate the old service:

```sh
rsync -av --delete -e ssh --exclude='.git' --exclude='node_modules/' \
  --exclude='.env' --exclude='.env.*' --exclude='.migration-backup/' \
  --exclude='.pnpm-store/' ./ linode:~/fplbasket/
ssh linode 'cd ~/fplbasket && if docker compose version >/dev/null 2>&1; then docker compose up --build -d; else docker-compose up --build -d; fi'
```

The protected remote `server/.env.production` must still exist (restore it securely from the retained copy if needed). Verify `/` and the site manually: the old app has no `/api/v1/health` endpoint. Keep the migrated checkout intact for a later retry.

`./build-and-git-commit-all.sh` preserves the build → stage all → commit → push workflow, stopping on failure. Build outputs and secrets are ignored. No commit, push, or deployment occurs merely by preparing the migration.
