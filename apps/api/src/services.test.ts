import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearCache } from "./cache.js";
import { getLeague } from "./services.js";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

describe("getLeague", () => {
  beforeEach(() => clearCache());
  afterEach(() => vi.unstubAllGlobals());

  it("fails fast while FPL is publishing teams for a new gameweek", async () => {
    const deadline = new Date(Date.now() - 60_000).toISOString();
    const requested: string[] = [];
    vi.stubGlobal("fetch", vi.fn(async (input: string | URL | Request) => {
      const path = new URL(String(input)).pathname;
      requested.push(path);
      if (path.endsWith("/bootstrap-static/")) {
        return json({
          events: [{ id: 7, name: "Gameweek 7", deadline_time: deadline, finished: false, is_current: true, is_next: false }],
          teams: [],
          elements: [],
        });
      }
      if (path.endsWith("/fixtures/")) {
        return json([{ id: 70, team_h: 1, team_a: 2, started: false, finished: false, finished_provisional: false }]);
      }
      if (path.endsWith("/leagues-classic/42/standings/")) {
        return json({
          league: { id: 42, name: "Test league" },
          standings: { results: [{ entry: 101, player_name: "Test Manager", entry_name: "Test Team", rank: 1, last_rank: 1, total: 100 }] },
        });
      }
      if (path.endsWith("/entry/101/event/7/picks/")) return json({}, 404);
      throw new Error(`Unexpected request: ${path}`);
    }));

    await expect(getLeague(42)).rejects.toMatchObject({
      status: 503,
      code: "GAMEWEEK_UPDATING",
      message: "FPL is updating teams for the new gameweek. Please try again shortly.",
      details: { eventId: 7 },
    });
    expect(requested).toEqual([
      "/api/bootstrap-static/",
      "/api/fixtures/",
      "/api/leagues-classic/42/standings/",
      "/api/entry/101/event/7/picks/",
    ]);
  });

  it("maps unavailable standings to the update state after the deadline", async () => {
    const deadline = new Date(Date.now() - 60_000).toISOString();
    vi.stubGlobal("fetch", vi.fn(async (input: string | URL | Request) => {
      const path = new URL(String(input)).pathname;
      if (path.endsWith("/bootstrap-static/")) {
        return json({
          events: [{ id: 7, name: "Gameweek 7", deadline_time: deadline, finished: false, is_current: false, is_next: true }],
          teams: [],
          elements: [],
        });
      }
      if (path.endsWith("/fixtures/")) {
        return json([{ id: 70, team_h: 1, team_a: 2, started: false, finished: false, finished_provisional: false }]);
      }
      if (path.endsWith("/leagues-classic/42/standings/")) return json("The game is being updated.", 503);
      throw new Error(`Unexpected request: ${path}`);
    }));

    await expect(getLeague(42)).rejects.toMatchObject({
      status: 503,
      code: "GAMEWEEK_UPDATING",
      details: { eventId: 7 },
    });
  });
});
