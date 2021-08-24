
export interface League {
  new_entries: NewEntries
  last_updated_data: string
  league: League
  standings: Standings
}

export interface NewEntries {
  has_next: boolean
  page: number
  results: any[]
}

export interface League {
  id: number
  name: string
  created: string
  closed: boolean
  max_entries: any
  league_type: string
  scoring: string
  admin_entry: number
  start_event: number
  code_privacy: string
  has_cup: boolean
  cup_league: any
  rank: any
}

export interface Standings {
  has_next: boolean
  page: number
  results: Result[]
}

export interface Result {
  id: number
  event_total: number
  player_name: string
  rank: number
  last_rank: number
  rank_sort: number
  total: number
  entry: number
  entry_name: string
}
