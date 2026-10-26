import type { League, Live, Manager } from "@fpl-basket/contracts";
import type { z } from "zod";
import type { fixturesSchema, historySchema, liveElementsSchema, picksSchema, standingResultSchema, transfersSchema } from "./upstream-schemas.js";

type Pick = z.infer<typeof picksSchema>["picks"][number];
type Sub = { element_in: number; element_out: number };
type Fixture = z.infer<typeof fixturesSchema>[number];
export type SquadPlayer = { team: number; element_type: number };
type PlayStatus = "played" | "out" | "pending";

export function splitPicks(picks: Pick[], activeChip: string | null, automaticSubs: { element_in: number; element_out: number }[]) {
  if (activeChip === "bboost") return { activePicks: picks, benchPicks: [] };
  const subsIn = new Set(automaticSubs.map((sub) => sub.element_in));
  const subsOut = new Set(automaticSubs.map((sub) => sub.element_out));
  const activePicks = picks.filter((pick) => (pick.position < 12 && !subsOut.has(pick.element)) || subsIn.has(pick.element))
    .map((pick) => subsIn.has(pick.element) ? { ...pick, multiplier: 1 } : pick);
  const activeIds = new Set(activePicks.map((pick) => pick.element));
  return { activePicks, benchPicks: picks.filter((pick) => !activeIds.has(pick.element)) };
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
    automaticSubs: picks.automatic_subs,
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

// FPL needs at least this many outfield players per position after a substitution.
const minimumByType = new Map([[2, 3], [3, 2], [4, 1]]);

function validFormation(types: (number | undefined)[]) {
  return [...minimumByType].every(([type, minimum]) => types.filter((item) => item === type).length >= minimum);
}

// FPL only applies automatic substitutions and vice-captaincy once the whole
// gameweek has been processed. Resolve them earlier when a player has already
// finished every fixture without minutes, and leave a substitution undecided
// while the bench player it depends on has still to play.
export function provisionalLineup(
  manager: Manager,
  squad: Map<number, SquadPlayer>,
  minutesById: Map<number, number>,
  fixtures: Fixture[],
  eventFinished: boolean,
) {
  const lineup = { managerId: manager.entry, activePicks: manager.activePicks, benchPicks: manager.benchPicks, automaticSubs: manager.automaticSubs, provisional: false };
  if (eventFinished) return lineup;
  const status = (element: number): PlayStatus => {
    if ((minutesById.get(element) ?? 0) > 0) return "played";
    const team = squad.get(element)?.team;
    if (team === undefined) return "pending";
    return fixtures.some((fixture) => (fixture.team_h === team || fixture.team_a === team) && !fixture.finished && !fixture.finished_provisional) ? "pending" : "out";
  };
  const type = (pick: Pick) => squad.get(pick.element)?.element_type;
  const byPosition = (a: Pick, b: Pick) => a.position - b.position;
  let { activePicks, benchPicks } = lineup;
  const automaticSubs: Sub[] = [];

  if (manager.activeChip !== "bboost" && manager.automaticSubs.length === 0) {
    let outfieldBlocked = false;
    for (const out of [...manager.activePicks].sort(byPosition)) {
      const outType = type(out);
      if (outType === undefined || status(out.element) !== "out") continue;
      const goalkeeper = outType === 1;
      if (!goalkeeper && outfieldBlocked) continue;
      for (const candidate of benchPicks.filter((pick) => (type(pick) === 1) === goalkeeper).sort(byPosition)) {
        const remaining = activePicks.filter((pick) => pick.element !== out.element);
        if (!goalkeeper && !validFormation([...remaining, candidate].map(type))) continue;
        const candidateStatus = status(candidate.element);
        if (candidateStatus === "out") continue;
        if (candidateStatus === "pending") {
          if (!goalkeeper) outfieldBlocked = true;
          break;
        }
        activePicks = activePicks.map((pick) => pick.element === out.element ? { ...candidate, multiplier: 1 } : pick);
        benchPicks = benchPicks.map((pick) => pick.element === candidate.element ? { ...out, multiplier: 0 } : pick);
        automaticSubs.push({ element_in: candidate.element, element_out: out.element });
        break;
      }
    }
  }

  const captain = manager.picks.find((pick) => pick.is_captain);
  const vice = activePicks.find((pick) => pick.is_vice_captain);
  let captaincyMoved = false;
  if (captain && vice && status(captain.element) === "out" && status(vice.element) !== "out") {
    const multiplier = Math.max(captain.multiplier, vice.multiplier);
    if (vice.multiplier !== multiplier) {
      captaincyMoved = true;
      activePicks = activePicks.map((pick) => pick.element === vice.element
        ? { ...pick, multiplier }
        : pick.element === captain.element ? { ...pick, multiplier: 1 } : pick);
    }
  }

  if (!automaticSubs.length && !captaincyMoved) return lineup;
  return { ...lineup, activePicks, benchPicks, automaticSubs: [...manager.automaticSubs, ...automaticSubs], provisional: true };
}

function provisionalBonus(fixtures: z.infer<typeof fixturesSchema>) {
  const result = new Map<number, Map<number, number>>();
  for (const fixture of fixtures) {
    const fixtureBonus = new Map<number, number>();
    result.set(fixture.id, fixtureBonus);
    const bonusAwarded = fixture.finished || fixture.stats.some((stat) => stat.identifier === "bonus" && stat.h.length + stat.a.length > 0);
    if (bonusAwarded) continue;
    const bps = fixture.stats.find((stat) => stat.identifier === "bps");
    const candidates = bps ? [...bps.h, ...bps.a] : [];
    let bonus = 3;
    while (bonus > 0 && candidates.length) {
      const best = Math.max(...candidates.map((candidate) => candidate.value));
      const tied = candidates.filter((candidate) => candidate.value === best);
      for (const candidate of tied) fixtureBonus.set(candidate.element, bonus);
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
  startsByPlayer = new Map<number, Map<number, number>>(),
  squad = new Map<number, SquadPlayer>(),
): Live {
  const bonus = provisionalBonus(fixtures);
  const rawById = new Map(rawLive.elements.map((player) => [player.id, player]));
  const active = fixtures.some((fixture) => fixture.started && !fixture.finished_provisional);
  const players = rawLive.elements.map((player) => {
    const playerFixtures = player.explain.map((item) => {
      const fixtureBonus = bonus.get(item.fixture)?.get(player.id) ?? 0;
      const starts = player.explain.length === 1
        ? player.stats.starts ?? null
        : startsByPlayer.get(player.id)?.get(item.fixture) ?? null;
      return { fixtureId: item.fixture, starts, stats: fixtureBonus > 0
        ? [...item.stats, { identifier: "live_bonus", points: fixtureBonus, value: fixtureBonus }]
        : item.stats };
    });
    const provisionalBonus = playerFixtures.reduce((sum, fixture) => sum + (bonus.get(fixture.fixtureId)?.get(player.id) ?? 0), 0);
    return { id: player.id, totalPoints: player.stats.total_points + provisionalBonus, provisionalBonus, fixtures: playerFixtures };
  });
  const pointsById = new Map(players.map((player) => [player.id, player.totalPoints]));
  const minutesById = new Map(rawLive.elements.map((player) => [player.id, player.stats.minutes
    ?? player.explain.flatMap((item) => item.stats).filter((stat) => stat.identifier === "minutes").reduce((sum, stat) => sum + stat.value, 0)]));
  const lineups = league.managers.map((manager) => provisionalLineup(manager, squad, minutesById, fixtures, league.event.finished));
  const lineupById = new Map(lineups.map((lineup) => [lineup.managerId, lineup]));
  const rows = league.managers.map((manager) => {
    const { activePicks } = lineupById.get(manager.entry)!;
    const gameweekPoints = activePicks.reduce((total, pick) => total + (pointsById.get(pick.element) ?? 0) * pick.multiplier, -manager.transferCost);
    const statuses = activePicks.map((pick) => {
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
  return { eventId, active, lastUpdated: new Date().toISOString(), fixtures, players, standings: rows, lineups };
}
