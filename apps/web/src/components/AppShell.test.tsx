import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "./AppShell";

const mocks = vi.hoisted(() => ({
  league: undefined as
    | undefined
    | { league: { id: number; name: string }; event: { id: number } },
  error: null as Error | null,
  saveLeague: vi.fn(),
}));

vi.mock("@/hooks", () => ({
  useLeagueQuery: () => ({ data: mocks.league, error: mocks.error }),
}));
vi.mock("@/saved-leagues", () => ({ saveLeague: mocks.saveLeague }));

describe("AppShell league history", () => {
  beforeEach(() => {
    mocks.league = undefined;
    mocks.error = null;
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
  afterEach(cleanup);

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

  it("links the logo and title back to the landing page", () => {
    renderShell();
    expect(
      screen.getByRole("link", { name: "Choose another league" }),
    ).toHaveAttribute("href", "/");
  });
});
