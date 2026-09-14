import { z } from "zod";

export const leagueIdSchema = z.coerce.number().int().positive();

export const eventSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  deadline_time: z.string(),
  finished: z.boolean(),
  is_current: z.boolean(),
  is_next: z.boolean(),
});

export const teamSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  short_name: z.string(),
});

export const playerSchema = z.object({
  id: z.number().int().positive(),
  first_name: z.string(),
  second_name: z.string(),
  web_name: z.string(),
  team: z.number().int(),
  team_code: z.number().int().optional(),
  element_type: z.number().int(),
  photo: z.string().optional(),
  now_cost: z.number().optional().default(0),
});

export const contextSchema = z.object({
  currentEvent: eventSchema,
  teams: z.array(teamSchema),
  players: z.array(playerSchema),
  app: z.object({ name: z.literal("FPL Basket"), leagueLimit: z.literal(50) }),
});

export const pickSchema = z.object({
  element: z.number().int(),
  position: z.number().int(),
  multiplier: z.number(),
  is_captain: z.boolean(),
  is_vice_captain: z.boolean(),
});

export const transferSchema = z.object({
  event: z.number().int(),
  element_in: z.number().int(),
  element_out: z.number().int(),
  element_in_cost: z.number().optional(),
  element_out_cost: z.number().optional(),
  time: z.string().optional(),
});

export const chipPlaySchema = z.object({ name: z.string(), event: z.number().int() });

export const managerSchema = z.object({
  entry: z.number().int(),
  playerName: z.string(),
  teamName: z.string(),
  rank: z.number().int(),
  previousRank: z.number().int(),
  previousPoints: z.number(),
  transferCost: z.number(),
  teamValue: z.number(),
  activeChip: z.string().nullable(),
  picks: z.array(pickSchema),
  activePicks: z.array(pickSchema),
  benchPicks: z.array(pickSchema),
  transfers: z.array(transferSchema),
  chips: z.array(chipPlaySchema),
});

const peopleGroupSchema = z.object({ playerId: z.number().int(), managerIds: z.array(z.number().int()) });

export const leagueSchema = z.object({
  league: z.object({ id: z.number().int(), name: z.string() }),
  event: eventSchema,
  managers: z.array(managerSchema).max(50),
  captains: z.array(peopleGroupSchema),
  ownership: z.array(peopleGroupSchema),
  chips: z.array(z.object({ chip: z.string(), managerIds: z.array(z.number().int()) })),
  transfers: z.array(z.object({
    managerId: z.number().int(),
    transfersIn: z.array(z.number().int()),
    transfersOut: z.array(z.number().int()),
    cost: z.number(),
    chip: z.string().nullable(),
  })),
});

export const fixtureSchema = z.object({
  id: z.number().int(),
  team_h: z.number().int(),
  team_a: z.number().int(),
  started: z.boolean().nullable().optional(),
  finished: z.boolean(),
  finished_provisional: z.boolean(),
  kickoff_time: z.string().nullable().optional(),
});

export const pointStatSchema = z.object({ identifier: z.string(), points: z.number(), value: z.number() });
export const playerLiveSchema = z.object({
  id: z.number().int(),
  totalPoints: z.number(),
  provisionalBonus: z.number(),
  fixtures: z.array(z.object({ fixtureId: z.number().int(), stats: z.array(pointStatSchema) })),
});

export const liveSchema = z.object({
  eventId: z.number().int(),
  active: z.boolean(),
  lastUpdated: z.string(),
  fixtures: z.array(fixtureSchema),
  players: z.array(playerLiveSchema),
  standings: z.array(z.object({
    managerId: z.number().int(),
    gameweekPoints: z.number(),
    totalPoints: z.number(),
    rank: z.number().int(),
    previousRank: z.number().int(),
    remaining: z.number().int(),
    playing: z.number().int(),
  })),
});

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export type Context = z.infer<typeof contextSchema>;
export type League = z.infer<typeof leagueSchema>;
export type Manager = z.infer<typeof managerSchema>;
export type Live = z.infer<typeof liveSchema>;
export type Player = z.infer<typeof playerSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
