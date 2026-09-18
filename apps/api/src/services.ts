import { leagueSchema, liveSchema, type League, type Live } from "@fpl-basket/contracts";
import { cached, cachedDynamic } from "./cache.js";
import { createManager, deriveLeague, deriveLive } from "./derive.js";
import { AppError } from "./errors.js";
import { fetchFpl, getContext } from "./fpl.js";
import { fixturesSchema, historySchema, liveElementsSchema, picksSchema, standingsSchema, transfersSchema } from "./upstream-schemas.js";

function gameweekIsUpdating(deadlineTime: string, fixtures: Awaited<ReturnType<typeof loadFixtures>>): boolean {
  const deadline = Date.parse(deadlineTime);
  return Number.isFinite(deadline) && deadline <= Date.now() && !fixtures.some((fixture) => fixture.started);
}

const loadFixtures = (eventId: number) => fetchFpl(`/fixtures/?event=${eventId}`, fixturesSchema);
const loadPicks = (eventId: number, entry: number) => cached(
  `event:${eventId}:picks:${entry}`,
  2 * 60_000,
  () => fetchFpl(`/entry/${entry}/event/${eventId}/picks/`, picksSchema),
);

export async function getLeague(leagueId: number): Promise<League> {
  const context = await getContext();
  const eventId = context.currentEvent.id;
  const cacheKey = `event:${eventId}:league:${leagueId}`;
  return cachedDynamic(cacheKey, async () => {
    const fixtures = await loadFixtures(eventId);
    const active = fixtures.some((fixture) => fixture.started && !fixture.finished_provisional);
    const standings = await fetchFpl(`/leagues-classic/${leagueId}/standings/`, standingsSchema);
    const results = standings.standings.results.slice(0, 50);

    // Immediately after a deadline, FPL exposes the new event before manager
    // picks are ready. Probe one entry before queueing requests for the entire
    // league so this temporary state returns promptly instead of appearing to
    // load indefinitely.
    if (results[0]) {
      try {
        await loadPicks(eventId, results[0].entry);
      } catch (error) {
        if (error instanceof AppError && gameweekIsUpdating(context.currentEvent.deadline_time, fixtures)) {
          throw new AppError(
            503,
            "GAMEWEEK_UPDATING",
            "FPL is updating teams for the new gameweek. Please try again shortly.",
          );
        }
        throw error;
      }
    }

    const managers = await Promise.all(results.map(async (standing) => {
      const [picks, history, transfers] = await Promise.all([
        loadPicks(eventId, standing.entry),
        cached(`history:${standing.entry}`, 60 * 60_000, () => fetchFpl(`/entry/${standing.entry}/history/`, historySchema)),
        cached(`transfers:${standing.entry}`, 60 * 60_000, () => fetchFpl(`/entry/${standing.entry}/transfers/`, transfersSchema)),
      ]);
      return createManager(standing, picks, history, transfers, eventId);
    }));
    return { value: leagueSchema.parse(deriveLeague(standings.league, context.currentEvent, managers)), ttl: active ? 2 * 60_000 : 10 * 60_000 };
  });
}

export async function getLive(leagueId: number): Promise<Live> {
  const context = await getContext();
  const eventId = context.currentEvent.id;
  return cachedDynamic(`event:${eventId}:live:${leagueId}`, async () => {
    const [league, rawLive, fixtures] = await Promise.all([
      getLeague(leagueId),
      fetchFpl(`/event/${eventId}/live/`, liveElementsSchema),
      fetchFpl(`/fixtures/?event=${eventId}`, fixturesSchema),
    ]);
    const value = liveSchema.parse(deriveLive(eventId, league, rawLive, fixtures));
    return { value, ttl: value.active ? 30_000 : 5 * 60_000 };
  });
}
