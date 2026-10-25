import { describe, expect, it } from "vitest";
import type { Context, Live } from "@fpl-basket/contracts";
import {
  defaultFixture,
  fixtureStatus,
  matchGoalscorers,
  matchPlayers,
  sortedFixtures,
} from "./scores";

const fixture = (
  id: number,
  kickoff_time: string | null,
  started = false,
  finished_provisional = false,
): Live["fixtures"][number] => ({
  id,
  kickoff_time,
  started,
  finished_provisional,
  finished: false,
  team_h: 1,
  team_a: 2,
});

describe("scores presentation", () => {
  it("lists fixture-specific scorers and credits own goals to the opponent", () => {
    const context = {
      players: [
        { id: 1, team: 1, element_type: 3, web_name: "Home" },
        { id: 2, team: 2, element_type: 2, web_name: "Away" },
      ],
    } as Context;
    const live = {
      players: context.players.map((player) => ({
        id: player.id,
        fixtures: [
          {
            fixtureId: 1,
            stats: [
              { identifier: "goals_scored", value: player.id === 1 ? 2 : 1, points: 0 },
              { identifier: "own_goals", value: 1, points: -2 },
            ],
          },
          { fixtureId: 2, stats: [{ identifier: "goals_scored", value: 3, points: 15 }] },
        ],
      })),
    } as Live;
    const match = fixture(1, null, true);
    expect(matchGoalscorers(context, live, match, 1)).toEqual([
      { player: context.players[0], count: 2, ownGoal: false },
      { player: context.players[1], count: 1, ownGoal: true },
    ]);
    expect(matchGoalscorers(context, live, match, 2)).toEqual([
      { player: context.players[1], count: 1, ownGoal: false },
      { player: context.players[0], count: 1, ownGoal: true },
    ]);
    expect(matchGoalscorers(context, live, fixture(3, null, true), 1)).toEqual([]);
    expect(matchGoalscorers(context, live, { ...match, started: false }, 1)).toEqual([]);
  });

  it("orders kickoff dates, places unscheduled fixtures last and prefers live matches", () => {
    const fixtures = [
      fixture(3, null),
      fixture(2, "2026-09-21T14:00:00Z", true),
      fixture(1, "2026-09-20T14:00:00Z", true, true),
    ];
    expect(sortedFixtures(fixtures).map((item) => item.id)).toEqual([1, 2, 3]);
    expect(defaultFixture(fixtures)?.id).toBe(2);
    expect(defaultFixture([fixtures[0]!, fixtures[2]!])?.id).toBe(1);
    expect(defaultFixture([fixtures[2]!])?.id).toBe(1);
    expect(defaultFixture([])).toBeUndefined();
    expect(fixtureStatus(fixtures[2]!)).toBe("FT");
  });

  it("prefers the latest finished match until an upcoming match has data", () => {
    const fixtures = [
      fixture(3, "2026-09-22T14:00:00Z"),
      fixture(1, "2026-09-20T14:00:00Z", true, true),
      { ...fixture(2, "2026-09-21T14:00:00Z", true), finished: true },
      fixture(4, "2026-09-23T14:00:00Z"),
    ];
    const players: Live["players"] = [{
      id: 1,
      totalPoints: 0,
      provisionalBonus: 0,
      fixtures: [{
        fixtureId: 4,
        starts: 0,
        stats: [{ identifier: "minutes", value: 0, points: 0 }],
      }],
    }];
    expect(defaultFixture(fixtures, players)?.id).toBe(2);
    players[0]!.fixtures[0]!.starts = 1;
    expect(defaultFixture(fixtures, players)?.id).toBe(4);
    players[0]!.fixtures[0]!.starts = null;
    players[0]!.fixtures[0]!.stats[0]!.value = 1;
    expect(defaultFixture(fixtures, players)?.id).toBe(4);
    expect(defaultFixture([
      ...fixtures,
      fixture(5, "2026-09-24T14:00:00Z", true),
    ], players)?.id).toBe(5);
    expect(defaultFixture([fixtures[0]!, fixtures[3]!])?.id).toBe(3);
    expect(defaultFixture([
      ...fixtures,
      { ...fixture(5, "2026-09-24T14:00:00Z"), team_h_score: 0 },
    ])?.id).toBe(5);
  });

  it("uses only the selected fixture's minutes, starts and points", () => {
    const context = {
      players: [{ id: 1, team: 1, element_type: 3, web_name: "Player" }],
    } as Context;
    const live = {
      players: [
        {
          id: 1,
          totalPoints: 20,
          fixtures: [
            {
              fixtureId: 1,
              starts: 1,
              stats: [
                { identifier: "minutes", value: 80, points: 2 },
                { identifier: "live_bonus", value: 3, points: 3 },
              ],
            },
            {
              fixtureId: 2,
              starts: 0,
              stats: [{ identifier: "minutes", value: 18, points: 1 }],
            },
          ],
        },
      ],
    } as Live;
    expect(matchPlayers(context, live, 2, 1)[0]).toMatchObject({
      starts: 0,
      minutes: 18,
      points: 1,
      provisionalBonus: 0,
    });
    expect(matchPlayers(context, live, 1, 1)[0]).toMatchObject({
      starts: 1,
      minutes: 80,
      points: 5,
      provisionalBonus: 3,
    });
    expect(matchPlayers(context, live, 2, 2)).toEqual([]);
  });
});
