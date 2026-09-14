import { describe, expect, it } from "vitest";
import { splitPicks } from "./derive.js";
import { resolveCurrentEvent } from "./fpl.js";

const event = (id: number, current = false, next = false) => ({ id, name: `GW ${id}`, deadline_time: new Date().toISOString(), finished: false, is_current: current, is_next: next });
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
    expect(result.benchPicks.map((item) => item.element)).toEqual([1]);
  });

  it("activates the full bench boost squad", () => {
    const picks = [pick(1, 1), pick(2, 12)];
    expect(splitPicks(picks, "bboost", []).activePicks).toHaveLength(2);
  });
});
