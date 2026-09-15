import type { League, Live, Manager } from "@fpl-basket/contracts";
import type { z } from "zod";
import type { fixturesSchema, historySchema, liveElementsSchema, picksSchema, standingResultSchema, transfersSchema } from "./upstream-schemas.js";

type Pick = z.infer<typeof picksSchema>["picks"][number];

export function splitPicks(picks: Pick[], activeChip: string | null, automaticSubs: { element_in: number; element_out: number }[]) {
  if (activeChip === "bboost") return { activePicks: picks, benchPicks: [] };
  const subsIn = new Set(automaticSubs.map((sub) => sub.element_in));
  const subsOut = new Set(automaticSubs.map((sub) => sub.element_out));
  const activePicks = picks.filter((pick) => (pick.position < 12 && !subsOut.has(pick.element)) || subsIn.has(pick.element));
  return { activePicks, benchPicks: picks.filter((pick) => !activePicks.includes(pick)) };
}

export function createManager(
  standing: z.infer<typeof standingResultSchema>,
  picks: z.infer<typeof picksSchema>,
  history: z.infer<typeof historySchema>,
  transfers: z.infer<typeof transfersSchema>,
  eventId: number,
): Manager {
  const previousPoints = history.current.find((item) => item.event === eventId - 1)?.total_points ?? 0;
  const split = splitPicks(picks.picks, picks.active_chip, picks.automatic_subs);
  return {
    entry: standing.entry,
    playerName: standing.player_name,
    teamName: standing.entry_name,
    rank: standing.rank,
    previousRank: standing.last_rank,
    previousPoints,
    transferCost: picks.entry_history.event_transfers_cost,
    teamValue: picks.entry_history.value,
    activeChip: picks.active_chip,
    picks: picks.picks,
    ...split,
    transfers: transfers.filter((transfer) => transfer.event === eventId),
    chips: history.chips,
  };
}

function groupedPlayers(managers: Manager[], select: (manager: Manager) => Pick[]) {
  const groups = new Map<number, number[]>();
  for (const manager of managers) for (const pick of select(manager)) {
    const owners = groups.get(pick.element) ?? [];
    owners.push(manager.entry);
    groups.set(pick.element, owners);
  }
  return [...groups].map(([playerId, managerIds]) => ({ playerId, managerIds })).sort((a, b) => b.managerIds.length - a.managerIds.length);
}

export function deriveLeague(league: League["league"], event: League["event"], managers: Manager[]): League {
  const ownership = groupedPlayers(managers, (manager) => manager.activePicks);
  const captains = groupedPlayers(managers, (manager) => manager.picks.filter((pick) => pick.is_captain));
  const chips = [...new Set(managers.map((manager) => manager.activeChip).filter((chip): chip is string => Boolean(chip)))]
    .map((chip) => ({ chip, managerIds: managers.filter((manager) => manager.activeChip === chip).map((manager) => manager.entry) }));
  const transfers = managers.filter((manager) => manager.transfers.length || manager.activeChip === "freehit" || manager.activeChip === "wildcard").map((manager) => ({
    managerId: manager.entry,
    transfersIn: manager.transfers.map((transfer) => transfer.element_in),
    transfersOut: manager.transfers.map((transfer) => transfer.element_out),
    cost: manager.transferCost,
    chip: manager.activeChip === "freehit" || manager.activeChip === "wildcard" ? manager.activeChip : null,
  }));
  return { league, event, managers, captains, ownership, chips, transfers };
}

function provisionalBonus(fixtures: z.infer<typeof fixturesSchema>) {
  const result = new Map<number, number>();
  for (const fixture of fixtures) {
    const bonusAwarded = fixture.finished || fixture.stats.some((stat) => stat.identifier === "bonus" && stat.h.length + stat.a.length > 0);
    if (bonusAwarded) continue;
    const bps = fixture.stats.find((stat) => stat.identifier === "bps");
    const candidates = bps ? [...bps.h, ...bps.a] : [];
    let bonus = 3;
    while (bonus > 0 && candidates.length) {
      const best = Math.max(...candidates.map((candidate) => candidate.value));
      const tied = candidates.filter((candidate) => candidate.value === best);
      for (const candidate of tied) result.set(candidate.element, (result.get(candidate.element) ?? 0) + bonus);
      for (const candidate of tied) candidates.splice(candidates.indexOf(candidate), 1);
      bonus -= tied.length;
    }
  }
  return result;
}

export function deriveLive(
  eventId: number,
  league: League,
  rawLive: z.infer<typeof liveElementsSchema>,
  fixtures: z.infer<typeof fixturesSchema>,
): Live {
  const bonus = provisionalBonus(fixtures);
  const rawById = new Map(rawLive.elements.map((player) => [player.id, player]));
  const active = fixtures.some((fixture) => fixture.started && !fixture.finished_provisional);
  const players = rawLive.elements.map((player) => ({
    id: player.id,
    totalPoints: player.stats.total_points + (bonus.get(player.id) ?? 0),
    provisionalBonus: bonus.get(player.id) ?? 0,
    fixtures: player.explain.map((item) => ({ fixtureId: item.fixture, stats: bonus.has(player.id) ? [...item.stats, { identifier: "live_bonus", points: bonus.get(player.id) ?? 0, value: bonus.get(player.id) ?? 0 }] : item.stats })),
  }));
  const pointsById = new Map(players.map((player) => [player.id, player.totalPoints]));
  const rows = league.managers.map((manager) => {
    const gameweekPoints = manager.activePicks.reduce((total, pick) => total + (pointsById.get(pick.element) ?? 0) * pick.multiplier, -manager.transferCost);
    const statuses = manager.activePicks.map((pick) => {
      const explains = rawById.get(pick.element)?.explain ?? [];
      const playerFixtures = explains.map((explain) => fixtures.find((fixture) => fixture.id === explain.fixture)).filter(Boolean);
      return {
        remaining: playerFixtures.filter((fixture) => !fixture?.finished_provisional).length,
        playing: playerFixtures.filter((fixture) => fixture?.started && !fixture.finished_provisional).length,
      };
    });
    return {
      managerId: manager.entry,
      gameweekPoints,
      totalPoints: manager.previousPoints + gameweekPoints,
      rank: 0,
      previousRank: manager.previousRank,
      remaining: statuses.reduce((sum, status) => sum + status.remaining, 0),
      playing: statuses.reduce((sum, status) => sum + status.playing, 0),
    };
  }).sort((a, b) => b.totalPoints - a.totalPoints).map((row, index) => ({ ...row, rank: index + 1 }));
  return { eventId, active, lastUpdated: new Date().toISOString(), fixtures, players, standings: rows };
}
