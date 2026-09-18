import { useQuery } from "@tanstack/react-query";
import { api, ApiRequestError } from "./api";

const retryUnlessGameweekIsUpdating = (failureCount: number, error: Error) =>
  !(error instanceof ApiRequestError && error.payload.code === "GAMEWEEK_UPDATING") && failureCount < 1;

export const useContextQuery = () => useQuery({ queryKey: ["context"], queryFn: ({ signal }) => api.context(signal), staleTime: 15 * 60_000, retry: 1 });
export const useLeagueQuery = (leagueId: string) => useQuery({ queryKey: ["league", leagueId], queryFn: ({ signal }) => api.league(leagueId, signal), staleTime: 2 * 60_000, retry: retryUnlessGameweekIsUpdating });
export const useLiveQuery = (leagueId: string) => useQuery({
  queryKey: ["live", leagueId],
  queryFn: ({ signal }) => api.live(leagueId, signal),
  staleTime: 25_000,
  refetchInterval: (query) => query.state.data?.active ? 30_000 : false,
  retry: 1,
});
