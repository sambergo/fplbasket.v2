export interface LeagueType {
  new_entries: NewEntries;
  last_updated_data: string;
  league: League;
  standings: Standings;
  teams: Team[];
  prev_gw_teams: PrevGwTeam[];
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

export interface Team {
  id: number;
  event_total: number;
  player_name: string;
  rank: number;
  last_rank: number;
  rank_sort: number;
  total: number;
  entry: number;
  entry_name: string;
  team: Team2;
}

export interface Team2 {
  active_chip: any;
  automatic_subs: any[];
  entry_history: EntryHistory;
  picks: Pick[];
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

export interface Pick {
  element: number;
  position: number;
  multiplier: number;
  is_captain: boolean;
  is_vice_captain: boolean;
}

export interface PrevGwTeam {
  id: number;
  event_total: number;
  player_name: string;
  rank: number;
  last_rank: number;
  rank_sort: number;
  total: number;
  entry: number;
  entry_name: string;
  team: Team3;
}

export interface Team3 {
  active_chip: any;
  automatic_subs: any[];
  entry_history: EntryHistory2;
  picks: Pick2[];
}

export interface EntryHistory2 {
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

export interface Pick2 {
  element: number;
  position: number;
  multiplier: number;
  is_captain: boolean;
  is_vice_captain: boolean;
}
