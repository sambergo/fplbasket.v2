export type FixturesRoot = Fixtures[];

export interface Fixtures {
  code: number;
  event: number;
  finished: boolean;
  finished_provisional: boolean;
  id: number;
  kickoff_time: string;
  minutes: number;
  provisional_start_time: boolean;
  started: boolean;
  team_a: number;
  team_a_score: number;
  team_h: number;
  team_h_score: number;
  stats: Stat[];
  team_h_difficulty: number;
  team_a_difficulty: number;
  pulse_id: number;
}

export interface Stat {
  identifier: string;
  a: A[];
  h: A[];
}

export interface A {
  value: number;
  element: number;
}
