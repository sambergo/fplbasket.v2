import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearCache } from "./cache.js";
import { getLeague, getLive } from "./services.js";

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


describe("scores lineup histories", () => {
  beforeEach(() => clearCache());
  afterEach(() => vi.unstubAllGlobals());

  it.each([false, true])("resolves double-gameweek starts without losing scores if history fails (%s)", async (historyFails) => {
    const requested: string[] = [];
    vi.stubGlobal("fetch", vi.fn(async (input: string | URL | Request) => {
      const path = new URL(String(input)).pathname;
      requested.push(path);
      if (path.endsWith("/bootstrap-static/")) return json({
        events: [{ id: 7, name: "GW7", deadline_time: "2026-09-20T10:00:00Z", finished: false, is_current: true, is_next: false }],
        teams: [], elements: [],
      });
      if (path.endsWith("/fixtures/")) return json([70, 71].map((id) => ({
        id, team_h: 1, team_a: 2, team_h_score: 1, team_a_score: 0, started: true, finished: true, finished_provisional: true,
      })));
      if (path.endsWith("/standings/")) return json({ league: { id: 42, name: "Test" }, standings: { results: [] } });
      if (path.endsWith("/live/")) return json({ elements: [{ id: 10, stats: { total_points: 3, starts: 1 }, explain: [70, 71].map((fixture) => ({
        fixture, stats: [{ identifier: "minutes", value: 30, points: 1 }],
      })) }] });
      if (path.endsWith("/element-summary/10/")) return historyFails ? json({}, 503) : json({ history: [{ fixture: 70, starts: 1 }, { fixture: 71, starts: 0 }] });
      throw new Error(`Unexpected request: ${path}`);
    }));
    const result = await getLive(42);
    expect(result.players[0]?.fixtures.map((fixture) => fixture.starts)).toEqual(historyFails ? [null, null] : [1, 0]);
    expect(result.fixtures[0]?.team_h_score).toBe(1);
    await getLive(42);
    expect(requested.filter((path) => path.includes("element-summary"))).toHaveLength(1);
  });
});
