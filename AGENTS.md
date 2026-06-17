# Repository Guidelines

## Project Structure & Module Organization

This repository contains FPL Basket, a TypeScript application split into two packages:

- `web/`: React 19 + Vite frontend using Material UI. Main entry points are `web/src/index.tsx` and `web/src/App.tsx`; reusable views live in `web/src/components/`, state in `web/src/state/`, shared frontend types in `web/src/types/`, and static assets in `web/public/`.
- `server/`: Express backend in TypeScript. `server/src/server.ts` wires middleware and routes; API route handlers are in `server/src/routes/`, helpers in `server/src/tools/`, and backend types in `server/src/types/`.
- `docs/plans/`: planning and modernization notes.
- Build outputs such as `server/dist/`, `server/build/`, and `web/dist/` are generated artifacts.

## Build, Test, and Development Commands

Use pnpm in each package directory.

- `cd web && pnpm install`: install frontend dependencies.
- `cd web && pnpm run dev`: start the Vite frontend dev server.
- `cd web && pnpm run build`: type-check and build the frontend.
- `cd web && pnpm run lint`: run frontend ESLint with zero warnings allowed.
- `cd server && pnpm install`: install backend dependencies.
- `cd server && pnpm run dev`: start the backend with nodemon from `src/server.ts`.
- `cd server && pnpm run build`: compile backend TypeScript to `server/dist/`.
- `./just-build.sh`: build server and web, copy `.env`, and move the frontend bundle into `server/build/` for deployment.

## Coding Style & Naming Conventions

Write TypeScript throughout. Follow the existing two-space indentation, double-quoted imports/strings, and semicolon style. React components use PascalCase filenames and exports, for example `ManagerPage.tsx`; helpers and service functions use camelCase, for example `getParsedLive.ts`. Keep route files focused on HTTP behavior and put parsing or data shaping in `server/src/tools/`.

## Testing Guidelines

No test framework is currently configured. Before submitting changes, at minimum run `pnpm run build` for the package you touched and `pnpm run lint` for frontend changes. If adding tests, place them beside the code they cover with a clear `*.test.ts` or `*.test.tsx` suffix and document any new test command in the relevant `package.json`.

## Commit & Pull Request Guidelines

Recent commits are short, imperative summaries such as `build`, `pnpm up`, and `update lock files`. Keep commits focused and concise, but prefer descriptive subjects when behavior changes, for example `fix live bonus toggle state`. Pull requests should include a short description, validation commands run, linked issue if applicable, and screenshots for visible UI changes.

## Security & Configuration Tips

The server requires `PORT` and loads environment values through `dotenv`. Do not commit `.env` files or secrets. Treat external FPL API responses as untrusted data and validate assumptions in route handlers or parsing helpers.
