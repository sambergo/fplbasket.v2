import { useQuery } from "@tanstack/react-query";
import { api, isGameweekUpdatingError } from "./api";

export const GAMEWEEK_UPDATE_INTERVAL_MS = 60_000;

export const leagueRefetchInterval = (error: unknown) =>
  isGameweekUpdatingError(error) ? GAMEWEEK_UPDATE_INTERVAL_MS : false;

export const leagueRefetchOnWindowFocus = (error: unknown, errorUpdatedAt: number, now = Date.now()) =>
  Boolean(error) && now - errorUpdatedAt >= GAMEWEEK_UPDATE_INTERVAL_MS ? "always" : false;

const retryUnlessGameweekIsUpdating = (failureCount: number, error: Error) =>
  !isGameweekUpdatingError(error) && failureCount < 1;

export const useContextQuery = () => useQuery({ queryKey: ["context"], queryFn: ({ signal }) => api.context(signal), staleTime: 15 * 60_000, retry: 1 });
export const useLeagueQuery = (leagueId: string) => useQuery({
  queryKey: ["league", leagueId],
  queryFn: ({ signal }) => api.league(leagueId, signal),
  staleTime: 2 * 60_000,
  retry: retryUnlessGameweekIsUpdating,
  refetchInterval: (query) => leagueRefetchInterval(query.state.error),
  refetchOnWindowFocus: (query) => leagueRefetchOnWindowFocus(query.state.error, query.state.errorUpdatedAt),
});
export const useLiveQuery = (leagueId: string) => useQuery({
  queryKey: ["live", leagueId],
  queryFn: ({ signal }) => api.live(leagueId, signal),
  staleTime: 25_000,
  refetchInterval: (query) => query.state.data?.active ? 30_000 : false,
  retry: 1,
});
