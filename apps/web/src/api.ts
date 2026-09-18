import { apiErrorSchema, contextSchema, leagueSchema, liveSchema, type ApiError, type Context, type League, type Live } from "@fpl-basket/contracts";
import type { z } from "zod";

export class ApiRequestError extends Error {
  constructor(public readonly payload: ApiError, public readonly status: number) { super(payload.message); }
}

export const isGameweekUpdatingError = (error: unknown): error is ApiRequestError =>
  error instanceof ApiRequestError && error.payload.code === "GAMEWEEK_UPDATING";

async function request<T>(path: string, schema: z.ZodType<T>, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, { signal });
  const body: unknown = await response.json();
  if (!response.ok) {
    const parsed = apiErrorSchema.safeParse(body);
    throw new ApiRequestError(parsed.success ? parsed.data : { code: "UNKNOWN_ERROR", message: "Something went wrong" }, response.status);
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new Error("The app received outdated data. Refresh the page and try again.");
  return parsed.data;
}

export const api = {
  context: (signal?: AbortSignal): Promise<Context> => request("/api/v1/context", contextSchema, signal),
  league: (leagueId: string, signal?: AbortSignal): Promise<League> => request(`/api/v1/leagues/${leagueId}`, leagueSchema, signal),
  live: (leagueId: string, signal?: AbortSignal): Promise<Live> => request(`/api/v1/leagues/${leagueId}/live`, liveSchema, signal),
};
