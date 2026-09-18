import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { api, ApiRequestError } from "./api";
import { GAMEWEEK_UPDATE_INTERVAL_MS, leagueRefetchInterval, leagueRefetchOnWindowFocus, useLeagueQuery } from "./hooks";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("league polling", () => {
  it("polls once a minute only during a gameweek update", () => {
    const updating = new ApiRequestError({ code: "GAMEWEEK_UPDATING", message: "Updating" }, 503);
    expect(leagueRefetchInterval(updating)).toBe(GAMEWEEK_UPDATE_INTERVAL_MS);
    expect(GAMEWEEK_UPDATE_INTERVAL_MS).toBe(60_000);
    expect(leagueRefetchInterval(new Error("Network unavailable"))).toBe(false);
    expect(leagueRefetchInterval(null)).toBe(false);
  });

  it("checks failed leagues on return only when the retry interval is due", () => {
    const updating = new ApiRequestError({ code: "GAMEWEEK_UPDATING", message: "Updating" }, 503);
    expect(leagueRefetchOnWindowFocus(updating, 1_000, 60_999)).toBe(false);
    expect(leagueRefetchOnWindowFocus(updating, 1_000, 61_000)).toBe("always");
    expect(leagueRefetchOnWindowFocus(new Error("Network unavailable"), 1_000, 61_000)).toBe("always");
    expect(leagueRefetchOnWindowFocus(null, 1_000, 61_000)).toBe(false);
  });

  it("automatically checks again after one minute", async () => {
    vi.useFakeTimers();
    const updating = new ApiRequestError({ code: "GAMEWEEK_UPDATING", message: "Updating" }, 503);
    const request = vi.spyOn(api, "league").mockRejectedValue(updating);
    const client = new QueryClient({ defaultOptions: { queries: { gcTime: Infinity } } });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );

    const query = renderHook(() => useLeagueQuery("42"), { wrapper });
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(query.result.current.isError).toBe(true);
    expect(request).toHaveBeenCalledTimes(1);

    await act(() => vi.advanceTimersByTimeAsync(GAMEWEEK_UPDATE_INTERVAL_MS - 1));
    expect(request).toHaveBeenCalledTimes(1);
    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(request).toHaveBeenCalledTimes(2);
    client.clear();
  });
});
