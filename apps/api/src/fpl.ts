import pLimit from "p-limit";
import type { z } from "zod";
import { contextSchema, type Context } from "@fpl-basket/contracts";
import { cached, clearEventScopedCache } from "./cache.js";
import { config } from "./config.js";
import { AppError } from "./errors.js";
import { bootstrapSchema } from "./upstream-schemas.js";

export const upstreamLimit = pLimit(10);

export async function fetchFpl<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  return upstreamLimit(async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.FPL_TIMEOUT_MS);
    try {
      const response = await fetch(`${config.FPL_BASE_URL}${path}`, { signal: controller.signal });
      if (!response.ok) {
        throw new AppError(response.status === 404 ? 404 : 502, "FPL_UPSTREAM_ERROR", "FPL data is temporarily unavailable", { upstreamStatus: response.status });
      }
      const parsed = schema.safeParse(await response.json());
      if (!parsed.success) throw new AppError(502, "INVALID_FPL_RESPONSE", "FPL returned an unexpected response");
      return parsed.data;
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error instanceof Error && error.name === "AbortError") throw new AppError(504, "FPL_TIMEOUT", "FPL took too long to respond");
      throw new AppError(502, "FPL_UNAVAILABLE", "FPL data is temporarily unavailable");
    } finally {
      clearTimeout(timer);
    }
  });
}

export function resolveCurrentEvent(events: z.infer<typeof bootstrapSchema>["events"]) {
  const next = events.find((item) => item.is_next);
  const nextDeadline = next ? Date.parse(next.deadline_time) : Number.NaN;
  const event = next && Number.isFinite(nextDeadline) && nextDeadline <= Date.now()
    ? next
    : events.find((item) => item.is_current) ?? next;
  if (!event) throw new AppError(503, "NO_CURRENT_GAMEWEEK", "No current gameweek is available");
  return event;
}

export async function getContext(): Promise<Context> {
  // Version the cache key when the projected bootstrap shape changes. This avoids
  // serving an in-memory value created before newly exposed player fields existed.
  const bootstrap = await cached("bootstrap:v3", 15 * 60_000, () => fetchFpl("/bootstrap-static/", bootstrapSchema));
  const currentEvent = resolveCurrentEvent(bootstrap.events);
  clearEventScopedCache(currentEvent.id);
  return contextSchema.parse({ currentEvent, teams: bootstrap.teams, players: bootstrap.elements, app: { name: "FPL Basket", leagueLimit: 50 } });
}
