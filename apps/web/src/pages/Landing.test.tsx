import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Landing } from "./Landing";

const storageKey = "fpl-basket:saved-leagues:v1";

describe("Landing", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

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

  it("reveals the landing video when playback starts", () => {
    const { container } = render(<MemoryRouter><Landing /></MemoryRouter>);
    const video = container.querySelector("video");
    expect(video).toHaveAttribute(
      "src",
      "/assets/864ade46-32f5-489f-9d9c-0a2ce49a558a.mp4",
    );
    fireEvent.playing(video!);
    expect(video).toHaveClass("is-ready");
    expect(container.querySelector(".landing__scene")).toHaveClass(
      "landing__scene--hidden",
    );
  });

  it("uses the landscape video and poster on desktop", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
    const { container } = render(<MemoryRouter><Landing /></MemoryRouter>);
    const video = container.querySelector("video");
    expect(video).toHaveAttribute(
      "src",
      "/assets/a388407c-1bd0-4ad3-949e-47f2a440ff06.mp4",
    );
    expect(video).toHaveAttribute(
      "poster",
      "/assets/fpl-basket-village-desktop.png",
    );
    expect(container.querySelector(".landing__scene")).not.toHaveClass(
      "landing__scene--hidden",
    );
    fireEvent.playing(video!);
    expect(video).toHaveClass("is-ready");
    expect(container.querySelector(".landing__scene")).toHaveClass(
      "landing__scene--hidden",
    );
  });
});
