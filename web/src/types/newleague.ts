export interface CurrPrevAndParsedLeague {
  league_curr: LeagueBase;
  league_prev: LeagueBase;
  parsedData: ParsedLeagueData;
}

export interface LeagueBase {
  new_entries: NewEntries;
  last_updated_data: string;
  league: League;
  standings: Standings;
  managers: Manager[];
}

export interface NewEntries {
  has_next: boolean;
  page: number;
  results: any[];
}

export interface League {
  id: number;
  name: string;
  created: string;
  closed: boolean;
  max_entries: any;
  league_type: string;
  scoring: string;
  admin_entry: number;
  start_event: number;
  code_privacy: string;
  has_cup: boolean;
  cup_league: any;
  rank: any;
}

export interface Standings {
  has_next: boolean;
  page: number;
  results: Result[];
}

export interface Result {
  id: number;
  event_total: number;
  player_name: string;
  rank: number;
  last_rank: number;
  rank_sort: number;
  total: number;
  entry: number;
  entry_name: string;
}

export interface Manager {
  id: number;
  event_total: number;
  player_name: string;
  rank: number;
  last_rank: number;
  rank_sort: number;
  total: number;
  entry: number;
  entry_name: string;
  gw_team: GwTeam;
}

export interface GwTeam {
  active_chip?: "bboost" | "3xc" | "wildcard" | "freehit";
  automatic_subs: AutomaticSub[];
  entry_history: EntryHistory;
  picks: PlayerPick[];
}

export interface EntryHistory {
  event: number;
  points: number;
  total_points: number;
  rank: number;
  rank_sort: number;
  overall_rank: number;
  bank: number;
  value: number;
  event_transfers: number;
  event_transfers_cost: number;
  points_on_bench: number;
}

export interface PlayerPick {
  element: number;
  position: number;
  multiplier: number;
  is_captain: boolean;
  is_vice_captain: boolean;
}

export interface AutomaticSub {
  entry: number;
  element_in: number;
  element_out: number;
  event: number;
}

export interface ParsedLeagueData {
  chips: Chip[];
  captains: Captain[];
  players: Player[];
  transfers: Transfer[];
  managers: ParsedManagerPick[];
}

export interface Chip {
  chip: string;
  usedBy: string[];
}

export interface Captain {
  captain: number;
  captainedBy: string[];
}

export interface Player {
  player: number;
  ownedBy: string[];
}

export interface Transfer {
  managerName: string;
  transfersIn: number[];
  transfersOut: number[];
  chip?: string;
}

export interface ParsedManagerPick {
  manager: Manager;
  parsedPicks: ActivePlayerPicks;
}

export interface ActivePlayerPicks {
  active: PlayerPick[];
  bench: PlayerPick[];
}
