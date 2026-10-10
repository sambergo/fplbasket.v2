import type { Context, Live } from "@fpl-basket/contracts";

export const fixtureStatus = (fixture: Live["fixtures"][number]) =>
  fixture.finished || fixture.finished_provisional
    ? "FT"
    : fixture.started
      ? "Live"
      : "Upcoming";

export function sortedFixtures(fixtures: Live["fixtures"]) {
  const kickoff = (value: string | null | undefined) => {
    const time = Date.parse(value ?? "");
    return Number.isFinite(time) ? time : Number.POSITIVE_INFINITY;
  };
  return [...fixtures].sort(
    (a, b) => kickoff(a.kickoff_time) - kickoff(b.kickoff_time) || a.id - b.id,
  );
}

export function defaultFixture(fixtures: Live["fixtures"]) {
  const sorted = sortedFixtures(fixtures);
  return (
    sorted.find((fixture) => fixtureStatus(fixture) === "Live") ??
    sorted.find((fixture) => fixtureStatus(fixture) === "Upcoming") ??
    sorted.at(-1)
  );
}

export function matchPlayers(
  context: Context,
  live: Live,
  fixtureId: number,
  teamId: number,
) {
  const byId = new Map(live.players.map((player) => [player.id, player]));
  return context.players
    .filter((player) => player.team === teamId)
    .map((player) => {
      const match = byId
        .get(player.id)
        ?.fixtures.find((fixture) => fixture.fixtureId === fixtureId);
      const stats = match?.stats ?? [];
      return {
        player,
        stats,
        starts: match?.starts,
        minutes:
          stats.find((stat) => stat.identifier === "minutes")?.value ?? 0,
        points: stats.reduce((sum, stat) => sum + stat.points, 0),
        provisionalBonus:
          stats.find((stat) => stat.identifier === "live_bonus")?.value ?? 0,
      };
    })
    .sort(
      (a, b) =>
        a.player.element_type - b.player.element_type ||
        a.player.web_name.localeCompare(b.player.web_name),
    );
}

export type MatchPlayer = ReturnType<typeof matchPlayers>[number];

export function matchGoalscorers(
  context: Context,
  live: Live,
  fixture: Live["fixtures"][number],
  teamId: number,
) {
  if (!fixture.started) return [];
  const opponentId = teamId === fixture.team_h ? fixture.team_a : fixture.team_h;
  return [teamId, opponentId].flatMap((id) => {
    const ownGoal = id === opponentId;
    return matchPlayers(context, live, fixture.id, id).flatMap((item) => {
      const count = item.stats
        .filter((stat) => stat.identifier === (ownGoal ? "own_goals" : "goals_scored"))
        .reduce((sum, stat) => sum + stat.value, 0);
      return count > 0 ? [{ player: item.player, count, ownGoal }] : [];
    });
  });
}
