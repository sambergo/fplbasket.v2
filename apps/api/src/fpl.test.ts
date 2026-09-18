import { describe, expect, it } from "vitest";
import { resolveCurrentEvent } from "./fpl.js";

const event = (id: number, deadline: string, flags: { current?: boolean; next?: boolean }) => ({
  id,
  name: `Gameweek ${id}`,
  deadline_time: deadline,
  finished: false,
  is_current: flags.current ?? false,
  is_next: flags.next ?? false,
});

describe("resolveCurrentEvent", () => {
  it("moves to the next gameweek as soon as its deadline passes", () => {
    const current = event(4, new Date(Date.now() - 7 * 24 * 60 * 60_000).toISOString(), { current: true });
    const next = event(5, new Date(Date.now() - 60_000).toISOString(), { next: true });
    expect(resolveCurrentEvent([current, next])).toEqual(next);
  });

  it("keeps the current gameweek before the next deadline", () => {
    const current = event(4, new Date(Date.now() - 7 * 24 * 60 * 60_000).toISOString(), { current: true });
    const next = event(5, new Date(Date.now() + 60_000).toISOString(), { next: true });
    expect(resolveCurrentEvent([current, next])).toEqual(current);
  });
});
