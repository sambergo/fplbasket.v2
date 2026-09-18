import type { Live } from "@fpl-basket/contracts";
import { describe, expect, it } from "vitest";
import { playerStatus, upcomingOpponents } from "./ManagerDetail";

const fixture = (
  id: number,
  started: boolean,
  finishedProvisional: boolean,
): Live["fixtures"][number] => ({
  id,
  team_h: 1,
  team_a: 2,
  started,
  finished: finishedProvisional,
  finished_provisional: finishedProvisional,
});

describe("playerStatus", () => {
  it("marks a player with an active fixture as live", () => {
    expect(playerStatus(1, [fixture(1, true, false)])).toBe("live");
  });

  it("marks a player with an unstarted fixture as upcoming", () => {
    expect(playerStatus(1, [fixture(1, false, false)])).toBe("upcoming");
  });

  it("marks a player whose fixtures are complete as played", () => {
    expect(playerStatus(1, [fixture(1, true, true)])).toBe("played");
  });

  it("prioritizes live and remaining fixtures in a double gameweek", () => {
    expect(
      playerStatus(1, [fixture(1, true, true), fixture(2, true, false)]),
    ).toBe("live");
    expect(
      playerStatus(1, [fixture(1, true, true), fixture(2, false, false)]),
    ).toBe("upcoming");
  });
});

describe("upcomingOpponents", () => {
  const teams = [
    { id: 1, name: "Home", short_name: "HOM" },
    { id: 2, name: "Away", short_name: "AWY" },
    { id: 3, name: "Later", short_name: "L8R" },
  ];

  it("formats home and away opponents", () => {
    expect(upcomingOpponents(1, [fixture(1, false, false)], teams)).toEqual([
      "AWY (H)",
    ]);
    expect(upcomingOpponents(2, [fixture(1, false, false)], teams)).toEqual([
      "HOM (A)",
    ]);
  });

  it("returns both opponents in kickoff order for a double gameweek", () => {
    const later = {
      ...fixture(2, false, false),
      team_a: 3,
      kickoff_time: "2026-09-20T18:00:00Z",
    };
    const sooner = {
      ...fixture(1, false, false),
      kickoff_time: "2026-09-19T18:00:00Z",
    };

    expect(upcomingOpponents(1, [later, sooner], teams)).toEqual([
      "AWY (H)",
      "L8R (H)",
    ]);
  });
});
