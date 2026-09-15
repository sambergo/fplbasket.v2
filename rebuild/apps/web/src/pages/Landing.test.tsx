import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Landing } from "./Landing";

const storageKey = "fpl-basket:saved-leagues:v1";

describe("Landing", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it("shows saved leagues as links and removes them", () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify([
        { id: 12, name: "Work league", lastViewedAt: 2 },
        { id: 8, name: "Friends league", lastViewedAt: 1 },
      ]),
    );
    render(<MemoryRouter><Landing /></MemoryRouter>);

    expect(screen.getByRole("link", { name: /Work league/ })).toHaveAttribute(
      "href",
      "/league/12/overview",
    );
    expect(screen.getByLabelText("League ID")).toHaveValue("");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Remove Work league from recent leagues",
      }),
    );
    expect(screen.queryByText("Work league")).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(storageKey) ?? "[]")).toHaveLength(1);
  });

  it("hides empty history and retains manual ID validation", () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    expect(screen.queryByText("Recent leagues")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("League ID"), {
      target: { value: "invalid" },
    });
    fireEvent.click(screen.getByRole("button", { name: "GO!" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a valid numeric league ID.",
    );
  });
});
