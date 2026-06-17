# Repository Guidelines

## Project Structure & Module Organization

FPL Basket is a TypeScript application split into two packages:

- `web/`: React 19 + Vite frontend using Material UI. Entry points are `web/src/index.tsx` and `web/src/App.tsx`; views live in `web/src/components/`, state in `web/src/state/`, types in `web/src/types/`, and assets in `web/public/`.
- `server/`: Express backend. `server/src/server.ts` wires middleware and routes; handlers are in `server/src/routes/`, helpers in `server/src/tools/`, and backend types in `server/src/types/`.
- `docs/plans/`: planning and modernization notes.
- `server/dist/`, `server/build/`, and `web/dist/`: generated build outputs.

## Build, Test, and Development Commands

Use pnpm from the relevant package directory.

- `cd web && pnpm run dev`: start the Vite frontend dev server.
- `cd web && pnpm run build`: type-check and build the frontend.
- `cd web && pnpm run lint`: run frontend ESLint with zero warnings allowed.
- `cd server && pnpm run dev`: start the backend with nodemon from `src/server.ts`.
- `cd server && pnpm run build`: compile backend TypeScript to `server/dist/`.
- `./just-build.sh`: build server and web, copy `.env`, and move the frontend bundle into `server/build/`.

## Coding Style & Naming Conventions

Write TypeScript throughout. Follow the existing two-space indentation, double-quoted imports/strings, and semicolon style. React components use PascalCase filenames, for example `ManagerPage.tsx`; helpers and service functions use camelCase, for example `getParsedLive.ts`. Keep HTTP behavior in route files and parsing or data shaping in `server/src/tools/`.

## Testing Guidelines

No test framework is currently configured. Before submitting changes, run `pnpm run build` for the package you touched and `pnpm run lint` for frontend changes. If adding tests, place them beside covered code with a `*.test.ts` or `*.test.tsx` suffix and document the command in `package.json`.

## Commit & Pull Request Guidelines

Recent commits are short summaries such as `build`, `pnpm up`, and `update lock files`. Keep commits focused, but prefer descriptive subjects for behavior changes, for example `fix live bonus toggle state`. Pull requests should include a description, validation commands, linked issue if applicable, and screenshots for UI changes.

## Security & Configuration Tips

The server requires `PORT` and loads environment values through `dotenv`. Do not commit `.env` files or secrets. Treat external FPL API responses as untrusted data and validate assumptions in route handlers or parsing helpers.
