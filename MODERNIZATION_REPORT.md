## FPL Basket modernization report (keep behavior, modernize implementation)

### Current snapshot (what you have today)
- **Frontend**: Vite + React 19 + TypeScript, React Router 7, Material UI (but via old `@material-ui/*` packages), Axios.
- **Backend**: Express + TypeScript (CJS build), Axios to call FPL endpoints, serves `server/build/` as static files and exposes `/api/data`, `/api/league`, `/api/live`.
- **Deploy**: Docker container for server; external networks for proxy and (apparently) a Mongo network (but no DB used in code shown).

### High-signal issues / “stupid stuff” worth fixing first
- **Material UI dependency is wrong/outdated**
  - `web/package.json` uses `@material-ui/core` `5.0.0-beta.5` and `@material-ui/icons` v4.
  - Modern MUI is `@mui/material` + `@mui/icons-material`. Staying on the beta package will keep you stuck with old APIs, odd peer deps, and harder upgrades.
- **React Router typings mismatch**
  - You’re on `react-router-dom` v7, but you also depend on `@types/react-router-dom` v5.
  - For v6+ (including v7), you typically **do not install** `@types/react-router-dom` (types ship with the package). This mismatch can silently degrade type safety and autocomplete.
- **API fan-out can hammer FPL (and timeout)**
  - `server/src/routes/league.ts` does `Promise.all` over every manager and for each manager does 3 HTTP calls (`picks`, `transfers`, `history`).
  - For leagues with many managers, this is a large burst of concurrent requests and can easily produce timeouts, 429s, or inconsistent results.
- **Caching is mentioned, but not implemented**
  - There are `redisCache` types, but the server routes appear to always fetch fresh.
  - For this app (read-heavy, same league/GW requested repeatedly), caching is one of the biggest wins.
- **Error handling and server hygiene are basic**
  - No centralized error middleware, no request logging, no security headers, permissive CORS, no rate limiting.

### Primary modernization goals (recommended)
- **Keep behavior the same**: same pages, same endpoints, same core flows.
- **Reduce fragility**: fewer timeouts, less dependency drift, more predictable builds.
- **Improve data fetching**: concurrency control + caching + better failure modes.
- **Raise type-safety** across the API boundary (so refactors don’t break silently).

## Recommended path (lowest risk, biggest ROI)

### Phase 1 (1–2 days): dependency + correctness fixes
- **Frontend: migrate to modern MUI**
  - Replace `@material-ui/core` and `@material-ui/icons` with:
    - `@mui/material`, `@mui/icons-material`, `@mui/system` (as needed), `@emotion/*` stays.
  - Update imports (e.g. `import { Box, Container } from "@mui/material";`).
  - Benefit: easier upgrades, better theme APIs, fewer peer dependency issues.
- **Frontend: fix React Router types**
  - Remove `@types/react-router-dom` (or align versions, but removal is the normal approach for v7).
  - Benefit: correct types, fewer confusing TS errors.
- **Backend: make environment/port robust**
  - Default `PORT` if unset; fail fast with a clear message if required env vars are missing.
  - Swap `require("dotenv").config()` for a consistent approach (CJS or ESM, not both).

### Phase 2 (2–5 days): API performance and reliability
- **Add caching (start simple, then optional Redis)**
  - Start with an in-process TTL cache (keyed by `leagueId + gw`) to avoid repeated fan-out work.
  - Add Redis as an opt-in (good for multi-instance deployments), but don’t make it required.
  - Cache layers that matter:
    - `/api/data` bootstrap-static: TTL 1–6 hours
    - `/api/league` for a given league+gw: TTL 1–15 minutes (or longer for old GWs)
    - `/api/live` for GW live elements: short TTL like 15–60 seconds
- **Limit concurrency when fetching many managers**
  - Use a small concurrency limit (e.g. 5–10 managers at a time) and still fetch each manager’s 3 endpoints in parallel.
  - Benefit: fewer timeouts, fewer spikes, friendlier to FPL’s infrastructure.
- **Add retry/backoff for transient failures**
  - For network flakiness and occasional 5xx/429s.
- **Introduce structured logging**
  - Add request IDs; log latency and upstream failures so you can debug “why is this slow today?”

### Phase 3 (3–7 days): type-safety + developer experience
- **API contracts**
  - Add request/response validation with a schema library (e.g. Zod) for `/api/league` and `/api/live`.
  - This catches bad inputs early and makes refactors safer.
- **Shared types**
  - Create a small shared package (or a `shared/` folder) for request/response types used by both `server/` and `web/`.
  - Benefit: fewer mismatched assumptions between FE/BE.
- **Frontend data fetching**
  - Consider TanStack Query for caching, deduping, and polling live endpoints.
  - Benefit: simpler loading/error states, fewer bespoke `useEffect` fetch patterns.
- **Replace `alert()`**
  - Use a snackbar/toast component and show a retry action (small UX upgrade, big perceived quality).

## Optional “rebuild” options (choose based on how much you want to change)

### Option A: stay SPA + API (recommended)
Keep Vite + React and Express (or swap Express for a smaller/faster framework later), but modernize dependencies, caching, and types. Lowest risk, fastest payoff.

### Option B: single “fullstack TS” app (moderate change)
- **Next.js (App Router) or Remix**
  - SSR/streaming can help SEO and perceived speed.
  - You can keep the same pages and data flows, but serve them with server rendering.
- **Route handlers for `/api/*`**
  - Keep your API shape but colocate it with the UI.
- Trade-off: bigger migration, but you simplify deployment to “one app”.

### Option C: typed RPC boundary (bigger internal change, same UX)
- Introduce **tRPC** (or OpenAPI + generated client) so `web/` calls are type-safe by default.
- Benefit: fewer runtime surprises and easier refactors.
- Trade-off: requires reworking `web/src/service.ts` and parts of server routing.

## Concrete improvements I’d implement regardless of architecture

### Backend hardening checklist
- **Security headers**: `helmet`
- **Compression**: `compression` (if not handled by proxy)
- **CORS**: restrict origins in prod instead of `cors()` default allow-all
- **Rate limiting**: per-IP and/or per-route (especially for expensive `/api/league`)
- **Timeouts**: you already use 10s upstream timeouts; also add server-side request timeouts
- **Centralized error handling**: one error middleware, consistent JSON error shape
- **Health endpoint**: `/healthz` for your proxy/monitoring

### Data quality + performance
- **Cache by “old GW vs current GW”**
  - Old gameweeks can be cached much longer (hours/days).
  - Current GW can be cached short.
- **Avoid sparse arrays keyed by ID**
  - Your live endpoint builds arrays indexed by element/fixture id; it works but is memory-inefficient and can be confusing.
  - Prefer `Record<number, T>` or `Map<number, T>` and only convert to arrays when needed for UI.

### Frontend UX quick wins (small changes)
- **Loading states**: skeletons while fetching league/live data
- **Persist selected GW and league ID in the URL**
  - Makes the app linkable/shareable and reduces “state lost on refresh”.
- **Error UX**: show “FPL API is slow” with retry/backoff instead of a blocking alert.

## Suggested target “modern baseline” (practical + future-proof)
- **Node**: 20/22 LTS (pin via `.nvmrc` or `volta`)
- **TypeScript**: strict in both apps (already close)
- **Frontend**: Vite + React 19 + `@mui/material` (current stable), TanStack Query (optional)
- **Backend**: Express (fine) + validation + caching + concurrency control (biggest real-world win)
- **Monorepo hygiene**: pnpm workspace, shared types, consistent lint/format, CI build+lint

## What I’d do first if I were “rebuilding” next weekend
- Fix MUI packages + React Router typings.
- Add caching + concurrency limit on `/api/league` fan-out.
- Add schema validation and consistent error responses.
- Then decide whether you still *need* a framework migration (Next/Remix) or if the app already feels “modern” after the above.
