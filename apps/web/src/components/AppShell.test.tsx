import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiRequestError } from "@/api";
import { AppShell } from "./AppShell";

const mocks = vi.hoisted(() => ({
  league: undefined as
    | undefined
    | { league: { id: number; name: string }; event: { id: number } },
  error: null as Error | null,
  errorUpdatedAt: 0,
  isFetching: false,
  refetch: vi.fn(),
  saveLeague: vi.fn(),
}));

vi.mock("@/hooks", () => ({
  useLeagueQuery: () => ({
    data: mocks.league,
    error: mocks.error,
    errorUpdatedAt: mocks.errorUpdatedAt,
    isFetching: mocks.isFetching,
    refetch: mocks.refetch,
  }),
}));
vi.mock("@/saved-leagues", () => ({ saveLeague: mocks.saveLeague }));

describe("AppShell league history", () => {
  beforeEach(() => {
    mocks.league = undefined;
    mocks.error = null;
    mocks.errorUpdatedAt = 0;
    mocks.isFetching = false;
    mocks.refetch.mockReset();
    mocks.saveLeague.mockReset();
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
    vi.stubGlobal("scrollTo", vi.fn());
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  const renderShell = () =>
    render(
      <MemoryRouter initialEntries={["/league/42/overview"]}>
        <Routes>
          <Route path="/league/:leagueId" element={<AppShell />}>
            <Route path="overview" element={<div>Overview</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

  it("records a successfully loaded league", async () => {
    mocks.league = {
      league: { id: 42, name: "Test league" },
      event: { id: 7 },
    };
    renderShell();
    await waitFor(() =>
      expect(mocks.saveLeague).toHaveBeenCalledWith({
        id: 42,
        name: "Test league",
      }),
    );
  });

  it("does not record a league before it loads successfully", () => {
    renderShell();
    expect(mocks.saveLeague).not.toHaveBeenCalled();
  });

  it("does not keep labeling a failed request as loading", () => {
    mocks.error = new Error("FPL is updating");
    renderShell();
    expect(screen.getByText("League unavailable")).toBeInTheDocument();
  });

  it("shows a dedicated status while FPL publishes the gameweek", () => {
    mocks.error = new ApiRequestError({
      code: "GAMEWEEK_UPDATING",
      message: "FPL is updating teams",
      details: { eventId: 7 },
    }, 503);
    renderShell();

    expect(screen.getByRole("heading", { name: "FPL is updating the new gameweek" })).toBeInTheDocument();
    expect(screen.getByText("GW 7 · Update in progress")).toBeInTheDocument();
    expect(screen.getByText("Checking again in 60s")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Choose another league" })).toHaveLength(1);
    expect(screen.queryByText("Overview")).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Main navigation" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Copy league link" })).not.toBeInTheDocument();
  });

  it("checks immediately and disables repeated manual checks", () => {
    mocks.error = new ApiRequestError({ code: "GAMEWEEK_UPDATING", message: "Updating" }, 503);
    const view = renderShell();
    fireEvent.click(screen.getByRole("button", { name: "Check now" }));
    expect(mocks.refetch).toHaveBeenCalledTimes(1);

    mocks.isFetching = true;
    view.rerender(
      <MemoryRouter initialEntries={["/league/42/overview"]}>
        <Routes>
          <Route path="/league/:leagueId" element={<AppShell />}>
            <Route path="overview" element={<div>Overview</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole("button", { name: "Checking…" })).toBeDisabled();
  });

  it("counts down and resets after a completed check", () => {
    vi.useFakeTimers();
    mocks.error = new ApiRequestError({ code: "GAMEWEEK_UPDATING", message: "Updating" }, 503);
    const view = renderShell();

    act(() => vi.advanceTimersByTime(1_000));
    expect(screen.getByText("Checking again in 59s")).toBeInTheDocument();

    mocks.errorUpdatedAt = 1;
    view.rerender(
      <MemoryRouter initialEntries={["/league/42/overview"]}>
        <Routes>
          <Route path="/league/:leagueId" element={<AppShell />}>
            <Route path="overview" element={<div>Overview</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("Checking again in 60s")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("returns to the requested league view when teams become available", () => {
    mocks.error = new ApiRequestError({ code: "GAMEWEEK_UPDATING", message: "Updating" }, 503);
    const view = renderShell();
    expect(screen.queryByText("Overview")).not.toBeInTheDocument();

    mocks.error = null;
    mocks.league = { league: { id: 42, name: "Test league" }, event: { id: 7 } };
    view.rerender(
      <MemoryRouter initialEntries={["/league/42/overview"]}>
        <Routes>
          <Route path="/league/:leagueId" element={<AppShell />}>
            <Route path="overview" element={<div>Overview</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("Overview")).toBeInTheDocument();
  });

  it("links the logo and title back to the landing page", () => {
    renderShell();
    expect(
      screen.getByRole("link", { name: "Choose another league" }),
    ).toHaveAttribute("href", "/");
  });
});
