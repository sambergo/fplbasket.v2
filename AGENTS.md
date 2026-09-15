# Repository Guidelines

## Project Structure & Module Organization

FPL Basket is a pnpm TypeScript workspace:

- `apps/web/`: React + Vite frontend with Tailwind, TanStack Query/Table, and Motion.
- `apps/api/`: Fastify backend serving `/api/v1` and the compiled SPA.
- `packages/contracts/`: shared Zod schemas and inferred types.
- `e2e/`: Playwright smoke tests; `docs/plans/`: historical planning notes.
- Package `dist/` folders are generated and ignored.

## Build, Test, and Development Commands

Use Node.js 24 and the pnpm version pinned in root `package.json`. Run from the root:

- `pnpm dev`: start the frontend and API (ports 5173 and 3637).
- `./just-build.sh`: frozen dependency installation and full workspace build.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`: workspace validation.
- `pnpm exec playwright test`: production browser smoke tests after building.
- `pnpm start`: serve the built application.
- `./deploy.sh`: build, rsync, Docker rebuild/start, and health check on Linode.

## Coding Style & Naming Conventions

Write TypeScript throughout. Follow the existing two-space indentation, double-quoted imports/strings, and semicolon style. React components use PascalCase filenames; helpers use descriptive lowercase or camelCase filenames. Keep HTTP behavior in the API app and data shaping in its services and derivation helpers.

## Testing Guidelines

Vitest tests live beside covered code as `*.test.ts` or `*.test.tsx`. Run the workspace build, typecheck, lint, and tests for changes. Run Playwright for routing or UI changes; validate Docker and deployment scripts for packaging changes.

## Commit & Pull Request Guidelines

Recent commits are short summaries such as `build`, `pnpm up`, and `update lock files`. Keep commits focused, but prefer descriptive subjects for behavior changes, for example `fix live bonus toggle state`. Pull requests should include a description, validation commands, linked issue if applicable, and screenshots for UI changes.

## Security & Configuration Tips

The API loads an optional root `.env`; process environment values take precedence. Compose supplies production settings and listens on port 3636. Never commit `.env` files or `.migration-backup/`. Treat external FPL API responses as untrusted data and validate them with the shared/upstream schemas.
