export interface Manager {
  active_chip: any
  automatic_subs: any[]
  entry_history: EntryHistory
  picks: Pick[]
}

export interface EntryHistory {
  event: number
  points: number
  total_points: number
  rank: number
  rank_sort: number
  overall_rank: number
  bank: number
  value: number
  event_transfers: number
  event_transfers_cost: number
  points_on_bench: number
}

export interface Pick {
  element: number
  position: number
  multiplier: number
  is_captain: boolean
  is_vice_captain: boolean
}
