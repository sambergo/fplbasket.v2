export interface RootLiveElements {
  elements: LiveElement[];
}

export interface LiveElement {
  id: number;
  stats: LiveStats;
  explain: LiveExplain[];
  live_bps?: number;
}

export interface LiveStats {
  minutes: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  goals_conceded: number;
  own_goals: number;
  penalties_saved: number;
  penalties_missed: number;
  yellow_cards: number;
  red_cards: number;
  saves: number;
  bonus: number;
  bps: number;
  influence: string;
  creativity: string;
  threat: string;
  ict_index: string;
  total_points: number;
  in_dreamteam: boolean;
}

export interface LiveExplain {
  fixture: number;
  stats: LiveStat[];
}

export interface LiveStat {
  identifier: string;
  points: number;
  value: number;
}
