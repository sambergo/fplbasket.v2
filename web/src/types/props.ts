import { DataType } from "./data";
import { LeagueType } from "./league";

export interface DefaultProps {
  bssData: DataType | undefined;
  leagueId: string;
  setleagueId: React.Dispatch<React.SetStateAction<string>>;
  selectedGW: number;
  setselectedGW: any;
  gws: DataType["events"];
  setleague: React.Dispatch<React.SetStateAction<LeagueType | null>>;
  league: LeagueType;
}
