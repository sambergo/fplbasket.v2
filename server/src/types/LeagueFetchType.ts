import { League } from "./league-from-fpl";

export interface LeagueFetchType {
  gw: string;
  leagueId: string;
}
export interface TeamsFetchType extends LeagueFetchType {
  standings: League["standings"];
}
