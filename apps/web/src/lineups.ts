import type { League, Live } from "@fpl-basket/contracts";

// Live data resolves automatic substitutions and vice-captaincy before FPL
// processes them at the end of the gameweek.
export function withLiveLineups(league: League, live: Live): League {
  const lineups = new Map(live.lineups.map((lineup) => [lineup.managerId, lineup]));
  return {
    ...league,
    managers: league.managers.map((manager) => {
      const lineup = lineups.get(manager.entry);
      return lineup
        ? { ...manager, activePicks: lineup.activePicks, benchPicks: lineup.benchPicks, automaticSubs: lineup.automaticSubs }
        : manager;
    }),
  };
}

export const hasProvisionalLineup = (live: Live, managerId: number) =>
  live.lineups.some((lineup) => lineup.managerId === managerId && lineup.provisional);
