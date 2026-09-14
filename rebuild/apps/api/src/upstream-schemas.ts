import { z } from "zod";
import { chipPlaySchema, eventSchema, fixtureSchema, pickSchema, playerSchema, teamSchema, transferSchema } from "@fpl-basket/contracts";

export const bootstrapSchema = z.object({
  events: z.array(eventSchema),
  teams: z.array(teamSchema),
  elements: z.array(playerSchema),
});

export const standingResultSchema = z.object({
  entry: z.number().int(),
  player_name: z.string(),
  entry_name: z.string(),
  rank: z.number().int(),
  last_rank: z.number().int(),
  total: z.number(),
});

export const standingsSchema = z.object({
  league: z.object({ id: z.number().int(), name: z.string() }),
  standings: z.object({ results: z.array(standingResultSchema) }),
});

export const picksSchema = z.object({
  active_chip: z.string().nullable(),
  automatic_subs: z.array(z.object({ element_in: z.number().int(), element_out: z.number().int() })),
  entry_history: z.object({
    event_transfers_cost: z.number(),
    value: z.number(),
  }),
  picks: z.array(pickSchema),
});

export const historySchema = z.object({
  current: z.array(z.object({ event: z.number().int(), total_points: z.number() }).passthrough()),
  chips: z.array(chipPlaySchema.passthrough()),
});

export const transfersSchema = z.array(transferSchema.passthrough());

export const liveElementSchema = z.object({
  id: z.number().int(),
  stats: z.object({ total_points: z.number() }).passthrough(),
  explain: z.array(z.object({
    fixture: z.number().int(),
    stats: z.array(z.object({ identifier: z.string(), points: z.number(), value: z.number() })),
  })),
});

export const liveElementsSchema = z.object({ elements: z.array(liveElementSchema) });
export const fixturesSchema = z.array(fixtureSchema.extend({
  stats: z.array(z.object({
    identifier: z.string(),
    h: z.array(z.object({ element: z.number().int(), value: z.number() })),
    a: z.array(z.object({ element: z.number().int(), value: z.number() })),
  })).default([]),
}));
