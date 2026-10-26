import { describe, expect, it } from "vitest";
import { provisionalLineup, splitPicks } from "./derive.js";
import { fixturesSchema } from "./upstream-schemas.js";
import { resolveCurrentEvent } from "./fpl.js";

const event = (id: number, current = false, next = false) => ({ id, name: `GW ${id}`, deadline_time: new Date(Date.now() + 60_000).toISOString(), finished: false, is_current: current, is_next: next });
const pick = (element: number, position: number) => ({ element, position, multiplier: position < 12 ? 1 : 0, is_captain: false, is_vice_captain: false });

describe("current event", () => {
  it("prefers is_current and falls back to is_next", () => {
    expect(resolveCurrentEvent([event(1, true), event(2, false, true)]).id).toBe(1);
    expect(resolveCurrentEvent([event(1), event(2, false, true)]).id).toBe(2);
  });
});

describe("pick splitting", () => {
  it("applies automatic substitutions", () => {
    const result = splitPicks([pick(1, 1), pick(2, 12)], null, [{ element_out: 1, element_in: 2 }]);
    expect(result.activePicks.map((item) => item.element)).toEqual([2]);
    expect(result.activePicks[0]?.multiplier).toBe(1);
    expect(result.benchPicks.map((item) => item.element)).toEqual([1]);
  });

  it("activates the full bench boost squad", () => {
    const picks = [pick(1, 1), pick(2, 12)];
    expect(splitPicks(picks, "bboost", []).activePicks).toHaveLength(2);
  });
});

describe("provisional lineup", () => {
  // 1 GK, 4 DEF, 4 MID, 2 FWD with bench GK, DEF, DEF, MID; elements equal positions.
  const types = [1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 1, 2, 2, 3];
  const squad = new Map(types.map((elementType, index) => [index + 1, { team: index + 1, element_type: elementType }]));
  const fixtures = (pending: number[] = []) => fixturesSchema.parse(types.map((_, index) => ({
    id: index + 1, team_h: index + 1, team_a: 100 + index, started: true,
    finished: false, finished_provisional: !pending.includes(index + 1),
  })));
  const manager = (overrides: { captain?: number; vice?: number; chip?: string | null; multiplier?: number } = {}) => {
    const { captain = 10, vice = 11, chip = null, multiplier = 2 } = overrides;
    const picks = types.map((_, index) => {
      const element = index + 1;
      return { element, position: element, multiplier: element === captain ? multiplier : chip === "bboost" || element < 12 ? 1 : 0, is_captain: element === captain, is_vice_captain: element === vice };
    });
    return {
      entry: 1, playerName: "P", teamName: "T", rank: 1, previousRank: 1, previousPoints: 0, transferCost: 0, teamValue: 1000,
      activeChip: chip, picks, ...splitPicks(picks, chip, []), automaticSubs: [], transfers: [], chips: [],
    };
  };
  const minutes = (zero: number[]) => new Map(types.map((_, index) => [index + 1, zero.includes(index + 1) ? 0 : 90]));
  const ids = (picks: { element: number }[]) => picks.map((pick) => pick.element);

  it("brings on the first bench player and doubles the vice-captain when the captain did not play", () => {
    const result = provisionalLineup(manager(), squad, minutes([10, 12]), fixtures(), false);
    expect(result.automaticSubs).toEqual([{ element_in: 13, element_out: 10 }]);
    expect(ids(result.benchPicks)).toEqual([12, 10, 14, 15]);
    expect(result.activePicks.find((pick) => pick.element === 11)?.multiplier).toBe(2);
    expect(result.activePicks.find((pick) => pick.element === 13)?.multiplier).toBe(1);
    expect(result.provisional).toBe(true);
  });

  it("keeps the formation valid and skips bench players who did not play", () => {
    const result = provisionalLineup(manager({ captain: 1, vice: 2 }), squad, minutes([10, 11, 13, 14]), fixtures(), false);
    // Losing both forwards: defenders would break the one-forward minimum, so only the midfielder qualifies.
    expect(result.automaticSubs).toEqual([{ element_in: 15, element_out: 10 }]);
  });

  it("waits while the next eligible bench player has still to play", () => {
    const result = provisionalLineup(manager({ captain: 1, vice: 2 }), squad, minutes([3, 13]), fixtures([13]), false);
    expect(result.automaticSubs).toEqual([]);
    expect(result.provisional).toBe(false);
  });

  it("waits for every fixture before treating a starter as absent", () => {
    const result = provisionalLineup(manager(), squad, minutes([10]), fixtures([10]), false);
    expect(result.provisional).toBe(false);
  });

  it("only substitutes goalkeepers with the bench goalkeeper", () => {
    const result = provisionalLineup(manager(), squad, minutes([1]), fixtures(), false);
    expect(result.automaticSubs).toEqual([{ element_in: 12, element_out: 1 }]);
  });

  it("gives the triple captain multiplier to the vice-captain and makes no bench boost substitutions", () => {
    const tripled = provisionalLineup(manager({ chip: "3xc", multiplier: 3 }), squad, minutes([10]), fixtures(), false);
    expect(tripled.activePicks.find((pick) => pick.element === 11)?.multiplier).toBe(3);
    const boosted = provisionalLineup(manager({ chip: "bboost" }), squad, minutes([10]), fixtures(), false);
    expect(boosted.automaticSubs).toEqual([]);
    expect(boosted.activePicks.find((pick) => pick.element === 11)?.multiplier).toBe(2);
  });

  it("leaves captaincy alone when the vice-captain did not play either", () => {
    expect(provisionalLineup(manager(), squad, minutes([10, 11, 13, 14, 15]), fixtures(), false).activePicks
      .find((pick) => pick.element === 11)?.multiplier).toBe(1);
  });

  it("defers to FPL once it has processed the gameweek", () => {
    expect(provisionalLineup(manager(), squad, minutes([10]), fixtures(), true).provisional).toBe(false);
  });
});
