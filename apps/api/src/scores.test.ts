import { describe, expect, it } from "vitest";
import { leagueSchema, liveSchema } from "@fpl-basket/contracts";
import { deriveLive } from "./derive.js";
import {
  fixturesSchema,
  liveElementsSchema,
  playerHistorySchema,
} from "./upstream-schemas.js";

const league = leagueSchema.parse({
  league: { id: 42, name: "Test" },
  event: {
    id: 1,
    name: "GW1",
    deadline_time: "2026-09-20T10:00:00Z",
    finished: false,
    is_current: true,
    is_next: false,
  },
  managers: [],
  captains: [],
  ownership: [],
  chips: [],
  transfers: [],
});
const fixture = (
  id: number,
  scores: [number | null, number | null] = [2, 0],
) => ({
  id,
  team_h: 1,
  team_a: 2,
  team_h_score: scores[0],
  team_a_score: scores[1],
  started: true,
  finished: false,
  finished_provisional: false,
  stats: [
    {
      identifier: "bps",
      h: [
        { element: 1, value: 30 },
        { element: 2, value: 30 },
      ],
      a: [{ element: 3, value: 20 }],
    },
  ],
});
const player = (id: number, starts: number, ids: number[]) => ({
  id,
  stats: { starts, total_points: 4 },
  explain: ids.map((fixture) => ({
    fixture,
    stats: [{ identifier: "minutes", value: 45, points: 1 }],
  })),
});

describe("scores data", () => {
  it("preserves scores, nullable scores and individual starts through the public contract", () => {
    const data = liveSchema.parse(
      deriveLive(
        1,
        league,
        liveElementsSchema.parse({
          elements: [player(1, 1, [1]), player(2, 0, [1])],
        }),
        fixturesSchema.parse([fixture(1), fixture(2, [null, null])]),
      ),
    );
    expect(
      data.fixtures.map((item) => [item.team_h_score, item.team_a_score]),
    ).toEqual([
      [2, 0],
      [null, null],
    ]);
    expect(data.players.map((item) => item.fixtures[0]?.starts)).toEqual([
      1, 0,
    ]);
  });

  it("allocates tied bonus per fixture without duplicating gameweek bonus", () => {
    const data = deriveLive(
      1,
      league,
      liveElementsSchema.parse({
        elements: [
          player(1, 1, [1, 2]),
          player(2, 1, [1, 2]),
          player(3, 1, [1, 2]),
        ],
      }),
      fixturesSchema.parse([fixture(1), fixture(2)]),
      new Map([
        [
          1,
          new Map([
            [1, 1],
            [2, 0],
          ]),
        ],
      ]),
    );
    expect(data.players[0]?.fixtures.map((item) => item.starts)).toEqual([
      1, 0,
    ]);
    expect(
      data.players[0]?.fixtures.map(
        (item) =>
          item.stats.find((stat) => stat.identifier === "live_bonus")?.points,
      ),
    ).toEqual([3, 3]);
    expect(data.players[0]).toMatchObject({
      totalPoints: 10,
      provisionalBonus: 6,
    });
    expect(data.players[2]?.provisionalBonus).toBe(2);
    expect(data.players[1]?.fixtures.map((item) => item.starts)).toEqual([
      null,
      null,
    ]);
  });

  it("stops estimating bonus when official bonus arrives", () => {
    const match = fixture(1);
    match.stats.push({
      identifier: "bonus",
      h: [{ element: 1, value: 3 }],
      a: [],
    });
    const result = deriveLive(
      1,
      league,
      liveElementsSchema.parse({ elements: [player(1, 1, [1])] }),
      fixturesSchema.parse([match]),
    );
    expect(result.players[0]?.provisionalBonus).toBe(0);
    expect(
      result.players[0]?.fixtures[0]?.stats.some(
        (stat) => stat.identifier === "live_bonus",
      ),
    ).toBe(false);
  });

  it("validates fixture-specific history rather than accepting malformed starts", () => {
    expect(
      playerHistorySchema.parse({
        history: [{ fixture: 1, starts: 0, minutes: 18 }],
      }).history,
    ).toEqual([{ fixture: 1, starts: 0 }]);
    expect(
      playerHistorySchema.safeParse({
        history: [{ fixture: 1, starts: "yes" }],
      }).success,
    ).toBe(false);
  });
});
