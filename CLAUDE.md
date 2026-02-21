# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FPL Basket ([fplbasket.com](https://fplbasket.com)) is a Fantasy Premier League analytics app. It fetches data from the official FPL API and presents mini-league statistics. The project has two workspaces managed with **pnpm**:

- `server/` — Express.js + TypeScript backend (runs on port 3636)
- `web/` — React + Vite + TypeScript frontend

## Commands

### Server (`server/`)

```sh
pnpm dev          # Start with nodemon (ts-node, hot reload)
pnpm build        # Compile TypeScript to dist/
```

### Web (`web/`)

```sh
pnpm dev          # Vite dev server (proxies API to localhost:3636)
pnpm build        # TypeScript check + Vite production build
pnpm lint         # ESLint (zero warnings allowed)
```

### Full production build

```sh
./just-build.sh   # Builds server (tsc) and web (vite), moves web/dist → server/build
```

The server serves the built frontend statically from `server/build/` and handles `/id/*` SPA routes. In development, `web/src/service.ts` points to `http://localhost:3636/api`; in production it uses `/api`.

## Architecture

### Data Flow

1. On load, the frontend calls `GET /api/data` → fetches FPL bootstrap-static data (players, teams, gameweeks)
2. User enters a league ID and gameweek → frontend calls `POST /api/league` with `{ leagueId, gw }`
3. Server fetches current GW and previous GW league data from FPL API in parallel, then runs `getParsedData` which computes: captains, owned players, transfers in/out, chips used
4. For live scoring, frontend calls `POST /api/live` with `{ gw }` → server fetches live element stats and fixtures, applies bonus point calculations

### Server Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/data` | GET | FPL bootstrap-static (players, teams, events) |
| `/api/league` | POST | League standings + all managers' picks/transfers/history for curr+prev GW |
| `/api/live` | POST | Live element stats and fixture state for a GW |

Key server tools in `server/src/tools/`:
- `fetchBssData.ts` — fetches bootstrap-static from FPL API
- `getParsedData.ts` — transforms raw league+manager data into derived stats (captains, ownership, transfers, chips); handles automatic subs and chip logic (bboost, freehit, wildcard)
- `getParsedLive.ts` — processes live element stats with bonus point adjustments
- `helpers.ts` — utilities like `getPreviousGwOrNull`

### Frontend State

Global state is managed via React Context + `useReducer` (`web/src/state/`). The `State` type holds:
- `bssData` — bootstrap-static data (players, teams, events)
- `leagueData` — `CurrPrevAndParsedLeague` (curr/prev raw data + `parsedData`)
- `gwsData` / `selectedGw` — available gameweeks and selection
- `liveData` — live scoring elements and fixtures
- `showLiveBonus` / `showLiveBonusDisabled` — live bonus toggle state

The app renders `<Landing>` until `leagueData` is set, then switches to `<League>`. The `League` component manages a local `page` state (`"main" | "transfers" | "standings" | "values"`).

### Key Frontend Types

- `web/src/types/data.ts` — `DataType` (bootstrap-static shape)
- `web/src/types/newleague.ts` — `CurrPrevAndParsedLeague`
- `web/src/types/livedata.ts` — `LiveData`
- `server/src/types/manager.ts` — `LeagueType`, `GwTeam`, `Player`, `Captain`
- `server/src/types/LeagueFetchType.ts` — request param shapes

## Deployment

Production runs via Docker Compose (`compose.yaml`). The server container exposes port 3636 and is placed behind nginx-proxy-manager. Build steps:

```sh
./just-build.sh                        # build both packages
./build-and-git-commit-all.sh          # build + commit
# then rsync to server and restart docker-compose
```

The `server/.env.production` is copied into the Docker image as `.env` and must contain `PORT=3636`.
