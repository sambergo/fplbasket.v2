import type { Live } from "@fpl-basket/contracts";
import { describe, expect, it } from "vitest";
import { describePlayerEvent, playerEvents } from "./player-events";

const player = (...matches: Record<string, number>[]): Live["players"][number] => ({
  id: 1,
  totalPoints: 30,
  provisionalBonus: 3,
  fixtures: matches.map((stats, index) => ({
    fixtureId: index + 1,
    stats: Object.entries(stats).map(([identifier, value]) => ({ identifier, value, points: value * 5 })),
  })),
});

describe("playerEvents", () => {
  it("sums event values across fixtures, ignoring points and unrelated stats", () => {
    const events = playerEvents(player(
      { goals_scored: 2, assists: 1, yellow_cards: 1, bonus: 3 },
      { goals_scored: 1, assists: 2, red_cards: 1, live_bonus: 3 },
    ));
    expect(events.map(describePlayerEvent)).toEqual(["3 goals", "3 assists", "1 yellow card", "1 red card"]);
  });

  it("keeps all rare decisive events in display order", () => {
    expect(playerEvents(player({ own_goals: 1, penalties_missed: 2, penalties_saved: 1 }))
      .map(describePlayerEvent)).toEqual(["1 own goal", "2 penalties missed", "1 penalty saved"]);
  });

  it("hides missing and zero events", () => {
    expect(playerEvents(undefined)).toEqual([]);
    expect(playerEvents(player())).toEqual([]);
    expect(playerEvents(player({ goals_scored: 0, minutes: 90, clean_sheets: 1, saves: 3, defensive_contribution: 1 }))).toEqual([]);
  });
});
