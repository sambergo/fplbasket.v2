export interface SavedLeague {
  id: number;
  name: string;
  lastViewedAt: number;
}

const STORAGE_KEY = "fpl-basket:saved-leagues:v1";
const MAX_SAVED_LEAGUES = 5;

const isSavedLeague = (value: unknown): value is SavedLeague => {
  if (!value || typeof value !== "object") return false;
  const league = value as Record<string, unknown>;
  return (
    Number.isInteger(league.id) &&
    Number(league.id) > 0 &&
    typeof league.name === "string" &&
    league.name.trim().length > 0 &&
    typeof league.lastViewedAt === "number" &&
    Number.isFinite(league.lastViewedAt)
  );
};

export function getSavedLeagues(): SavedLeague[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];

    const leagues = new Map<number, SavedLeague>();
    parsed
      .filter(isSavedLeague)
      .sort((a, b) => b.lastViewedAt - a.lastViewedAt)
      .forEach((league) => {
        if (!leagues.has(league.id)) leagues.set(league.id, league);
      });
    return [...leagues.values()].slice(0, MAX_SAVED_LEAGUES);
  } catch {
    return [];
  }
}

export function saveLeague(
  league: Pick<SavedLeague, "id" | "name">,
  lastViewedAt = Date.now(),
): SavedLeague[] {
  const saved = [
    { ...league, name: league.name.trim(), lastViewedAt },
    ...getSavedLeagues().filter((item) => item.id !== league.id),
  ].slice(0, MAX_SAVED_LEAGUES);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // Browsing still works when storage is unavailable.
  }
  return saved;
}

export function removeSavedLeague(id: number): SavedLeague[] {
  const saved = getSavedLeagues().filter((league) => league.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // Keep the in-memory result usable when storage is unavailable.
  }
  return saved;
}
