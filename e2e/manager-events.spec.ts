import { expect, test } from "@playwright/test";
import type { Context, League, Live } from "../packages/contracts/src/index";

const event = { id: 1, name: "Gameweek 1", deadline_time: "2026-09-19T10:00:00Z", finished: false, is_current: true, is_next: false };
const players = Array.from({ length: 15 }, (_, index) => ({
  id: index + 1, first_name: "Player", second_name: `${index + 1}`, web_name: `Player ${index + 1}`,
  team: 1, team_code: 3, element_type: index === 0 || index === 11 ? 1 : index < 6 ? 2 : index < 9 ? 3 : 4,
  now_cost: 50,
}));
const picks = players.map((player, index) => ({
  element: player.id, position: index + 1, multiplier: index > 10 ? 0 : index === 1 ? 3 : 1,
  is_captain: index === 1, is_vice_captain: index === 2,
}));
const context: Context = {
  currentEvent: event, players, app: { name: "FPL Basket", leagueLimit: 50 },
  teams: [{ id: 1, name: "Home", short_name: "HOM" }, { id: 2, name: "Away", short_name: "AWY" }],
};
const league: League = {
  league: { id: 42, name: "Test league" }, event,
  managers: [{ entry: 7, playerName: "Test manager", teamName: "Event badges", rank: 1, previousRank: 1,
    previousPoints: 0, transferCost: 0, teamValue: 1000, activeChip: null, picks,
    activePicks: picks.slice(0, 11), benchPicks: picks.slice(11), transfers: [], chips: [] }],
  captains: [], ownership: [], chips: [], transfers: [],
};
const stats = (values: Record<string, number>) => Object.entries(values).map(([identifier, value]) => ({ identifier, value, points: 5 * value }));
const live: Live = {
  eventId: 1, active: true, lastUpdated: "2026-09-20T12:00:00Z",
  fixtures: [
    { id: 1, team_h: 1, team_a: 2, started: true, finished: true, finished_provisional: true },
    { id: 2, team_h: 2, team_a: 1, started: false, finished: false, finished_provisional: false },
  ],
  players: players.map((player) => ({ id: player.id, totalPoints: 12, provisionalBonus: 0, fixtures: [
    { fixtureId: 1, stats: stats(player.id === 2 ? { goals_scored: 2, assists: 2, yellow_cards: 2, red_cards: 2, own_goals: 2, penalties_missed: 2, penalties_saved: 2 } : player.id === 12 ? { penalties_saved: 2 } : player.id === 3 ? {} : { goals_scored: 1 }) },
    { fixtureId: 2, stats: [] },
  ] })),
  standings: [{ managerId: 7, gameweekPoints: 50, totalPoints: 50, rank: 1, previousRank: 1, remaining: 11, playing: 0 }],
};

test("manager event badges show unmultiplied gameweek counts and remain usable on the pitch", async ({ page }, testInfo) => {
  await page.route("**/api/v1/**", (route) => {
    const path = new URL(route.request().url()).pathname;
    const body = path.endsWith("/context") ? context : path.endsWith("/live") ? live : league;
    return route.fulfill({ json: body });
  });
  await page.route("https://fantasy.premierleague.com/**", (route) => route.fulfill({
    contentType: "image/svg+xml",
    body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><path fill="#e85454" stroke="#fff" d="m25 8-20 14 10 16 10-5v40h30V33l10 5 10-16L55 8 40 18Z"/></svg>',
  }));
  await page.goto("/league/42/managers/7");
  const captain = page.getByRole("link", { name: /^Player 2, Captain,/ });
  await expect(captain).toHaveAccessibleName(/Still to play, 36 points, AWY \(A\), 2 goals, 2 assists, 2 yellow cards, 2 red cards, 2 own goals, 2 penalties missed, 2 penalties saved/);
  await expect(captain.locator(".player-event")).toHaveCount(14);
  await expect(captain.getByTitle("2 goals").locator(".player-event")).toHaveCount(2);
  for (const label of ["goals", "assists", "yellow cards", "red cards", "own goals", "penalties missed", "penalties saved"]) {
    await expect(captain.getByTitle(`2 ${label}`, { exact: true }).locator(".player-event")).toHaveCount(2);
  }
  await expect(captain).not.toContainText("×");
  const goalsOverlap = async () => captain.getByTitle(/^\d+ goals$/).locator(".player-event").evaluateAll((badges) =>
    badges.slice(1).every((badge, index) => {
      const previous = badges[index]!.getBoundingClientRect();
      const current = badge.getBoundingClientRect();
      return current.left > previous.left && current.left < previous.right - 2;
    }),
  );
  expect(await goalsOverlap()).toBe(true);
  await expect(page.locator(".squad-bench").getByRole("link", { name: /^Player 12,/ })).toHaveAccessibleName(/12 points.*2 penalties saved/);
  await expect(page.locator(".squad-bench").getByRole("link", { name: /^Player 12,/ }).locator("small")).toContainText("12 pts");
  await expect(page.locator(".squad-pitch__badge--points")).toHaveText("Total: 50");
  await expect(page.getByRole("link", { name: /^Player 3,/ }).locator(".player-events")).toHaveCount(0);


  // Icons overlay the lower corners; shirt geometry never depends on event count.
  const shirtGeometry = async () => captain.evaluate((card) => {
    const rect = card.getBoundingClientRect();
    const shirt = card.querySelector(".squad-player__shirt")!.getBoundingClientRect();
    return { x: shirt.x - rect.x, y: shirt.y - rect.y, width: shirt.width, height: shirt.height };
  });
  const originalShirt = await shirtGeometry();
  const emptyShirt = await page.getByRole("link", { name: /^Player 3,/ }).evaluate((card) => {
    const rect = card.getBoundingClientRect();
    const shirt = card.querySelector(".squad-player__shirt")!.getBoundingClientRect();
    return { x: shirt.x - rect.x, y: shirt.y - rect.y, width: shirt.width, height: shirt.height };
  });
  for (const key of ["x", "y", "width", "height"] as const) {
    expect(originalShirt[key]).toBeCloseTo(emptyShirt[key], 1);
  }
  const layout = await captain.evaluate((card) => {
    const rect = card.getBoundingClientRect();
    const name = card.querySelector(".squad-player__label")!.getBoundingClientRect();
    const marker = card.querySelector(".squad-player__captain")!.getBoundingClientRect();
    return [...card.querySelectorAll(".player-event")].every((badge) => {
      const box = badge.getBoundingClientRect();
      return box.left >= rect.left - 1 && box.right <= rect.right + 1 && box.bottom <= name.top
        && (box.left >= marker.right || box.top >= marker.bottom || box.right <= marker.left);
    });
  });
  expect(layout).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.locator(".manager-team-section").screenshot({ path: testInfo.outputPath("manager-events.png") });

  // Live revisions replace counts, rather than accumulating stale events.
  await page.route("**/api/v1/leagues/42/live", (route) => route.fulfill({ json: {
    ...live, players: live.players.map((player) => player.id === 2 ? { ...player, fixtures: [
      { fixtureId: 1, stats: stats({ goals_scored: 1 }) }, { fixtureId: 2, stats: stats({ goals_scored: 2 }) },
    ] } : player),
  } }));
  await page.reload();
  await expect(captain).toHaveAccessibleName(/3 goals$/);
  await expect(captain.getByTitle("3 goals").locator(".player-event")).toHaveCount(3);
  expect(await goalsOverlap()).toBe(true);
  const updatedShirt = await shirtGeometry();
  for (const key of ["x", "y", "width", "height"] as const) {
    expect(updatedShirt[key]).toBeCloseTo(originalShirt[key], 1);
  }
  await captain.focus();
  await expect(captain).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/players\/2$/);
});
