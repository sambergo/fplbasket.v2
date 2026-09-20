import { describe, expect, it } from "vitest";
import type { Context, Live } from "@fpl-basket/contracts";
import {
  defaultFixture,
  fixtureStatus,
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
  it("orders kickoff dates, places unscheduled fixtures last and prefers live matches", () => {
    const fixtures = [
      fixture(3, null),
      fixture(2, "2026-09-21T14:00:00Z", true),
      fixture(1, "2026-09-20T14:00:00Z", true, true),
    ];
    expect(sortedFixtures(fixtures).map((item) => item.id)).toEqual([1, 2, 3]);
    expect(defaultFixture(fixtures)?.id).toBe(2);
    expect(defaultFixture([fixtures[0]!, fixtures[2]!])?.id).toBe(3);
    expect(defaultFixture([fixtures[2]!])?.id).toBe(1);
    expect(defaultFixture([])).toBeUndefined();
    expect(fixtureStatus(fixtures[2]!)).toBe("FT");
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
