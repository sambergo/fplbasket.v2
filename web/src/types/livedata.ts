export interface LiveData {
  elements: Array<ElementLive | null>;
  fixtures: Array<FixtureLive | null>;
}

export interface ElementLive {
  id: number;
  stats: StatsLive;
  explain: ExplainLive[];
  live_bps?: number;
}

export interface ExplainLive {
  fixture: number;
  stats: ExplainStat[];
}

export interface ExplainStat {
  identifier: Identifier;
  points: number;
  value: number;
}

export enum Identifier {
  Assists = "assists",
  Bonus = "bonus",
  CleanSheets = "clean_sheets",
  GoalsConceded = "goals_conceded",
  GoalsScored = "goals_scored",
  Minutes = "minutes",
  PenaltiesMissed = "penalties_missed",
  RedCards = "red_cards",
  Saves = "saves",
  YellowCards = "yellow_cards",
}

export interface StatsLive {
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

export interface FixtureLive {
  code: number;
  event: number;
  finished: boolean;
  finished_provisional: boolean;
  id: number;
  kickoff_time: Date;
  minutes: number;
  provisional_start_time: boolean;
  started: boolean;
  team_a: number;
  team_a_score: number | null;
  team_h: number;
  team_h_score: number | null;
  stats: FixtureStat[];
  team_h_difficulty: number;
  team_a_difficulty: number;
  pulse_id: number;
}

export interface FixtureStat {
  identifier: string;
  a: A[];
  h: A[];
}

export interface A {
  value: number;
  element: number;
}
