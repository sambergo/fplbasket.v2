import { expect, test } from "@playwright/test";

const event = {
  id: 5,
  name: "Gameweek 5",
  deadline_time: "2026-09-19T10:00:00Z",
  finished: false,
  is_current: true,
  is_next: false,
};
const names = [
  "Raya",
  "Timber",
  "Saliba",
  "Gabriel",
  "Calafiori",
  "Rice",
  "Ødegaard",
  "Saka",
  "Eze",
  "Martinelli",
  "Gyökeres",
  "Trossard",
  "Nwaneri",
  "White",
];
const awayNames = [
  "Donnarumma",
  "Nunes",
  "Dias",
  "Guéhi",
  "Gvardiol",
  "Fernández",
  "Anderson",
  "Ndiaye",
  "Cherki",
  "Semenyo",
  "Haaland",
  "Foden",
  "Doku",
  "Savinho",
];
const players = [1, 2].flatMap((team) =>
  Array.from({ length: 14 }, (_, index) => ({
    id: (team - 1) * 14 + index + 1,
    first_name: "Player",
    second_name: String(index),
    web_name: (team === 1 ? names : awayNames)[index],
    team,
    code: 123,
    element_type: index === 0 ? 1 : index < 5 ? 2 : index === 10 ? 4 : 3,
    now_cost: 50,
  })),
);
const picks = players.slice(0, 14).map((player, index) => ({
  element: player.id,
  position: index + 1,
  multiplier: index < 11 ? 1 : 0,
  is_captain: index === 7,
  is_vice_captain: index === 10,
}));
const context = {
  currentEvent: event,
  players,
  teams: [
    { id: 1, name: "Arsenal", short_name: "ARS" },
    { id: 2, name: "Manchester City", short_name: "MCI" },
  ],
  app: { name: "FPL Basket", leagueLimit: 50 },
};
const league = {
  league: { id: 42, name: "Weekend league" },
  event,
  managers: [
    {
      entry: 7,
      playerName: "Alex Manager",
      teamName: "North London",
      rank: 1,
      previousRank: 1,
      previousPoints: 200,
      transferCost: 0,
      teamValue: 1000,
      activeChip: null,
      picks,
      activePicks: picks.slice(0, 12),
      benchPicks: picks.slice(11),
      automaticSubs: [],
      transfers: [],
      chips: [],
    },
  ],
  captains: [],
  ownership: [],
  chips: [],
  transfers: [],
};
const live = {
  eventId: 5,
  active: true,
  lastUpdated: "2026-09-20T15:25:00Z",
  fixtures: [
    {
      id: 1,
      team_h: 1,
      team_a: 2,
      team_h_score: 2,
      team_a_score: 1,
      minutes: 90,
      started: true,
      finished: false,
      finished_provisional: false,
      kickoff_time: "2026-09-20T14:00:00Z",
    },
    {
      id: 2,
      team_h: 2,
      team_a: 1,
      team_h_score: null,
      team_a_score: null,
      started: false,
      finished: false,
      finished_provisional: false,
      kickoff_time: "2026-09-23T19:00:00Z",
    },
  ],
  players: players.map((player, index) => ({
    id: player.id,
    totalPoints: 9,
    provisionalBonus: 0,
    fixtures: [
      {
        fixtureId: 1,
        starts: index % 14 < 11 ? 1 : 0,
        stats: [
          {
            identifier: "minutes",
            points: 2,
            value:
              index % 14 === 0
                ? 90
                : index % 14 < 11
                  ? 72
                  : index % 14 < 13
                    ? 18
                    : 0,
          },
          ...(index % 14 === 7
            ? [
                { identifier: "goals_scored", points: 5, value: 1 },
                { identifier: "assists", points: 3, value: 1 },
              ]
            : []),
        ],
      },
      { fixtureId: 2, starts: null, stats: [] },
    ],
  })),
  standings: [],
};

test.beforeEach(async ({ page }) => {
  await page.route("**/api/v1/**", (route) => {
    const path = new URL(route.request().url()).pathname;
    return route.fulfill({
      json: path.endsWith("/context")
        ? context
        : path.endsWith("/live")
          ? live
          : league,
    });
  });
  await page.route("https://resources.premierleague.com/**", (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 140"><circle cx="55" cy="43" r="28" fill="#eac2a0"/><path d="M18 140V105Q18 72 55 72Q92 72 92 105V140" fill="#cad5ed"/><path d="M27 39Q22 6 55 9Q91 8 83 40L72 25H39Z" fill="#41342e"/></svg>',
    }),
  );
});

test("scores separates starters and substitutes and opens league owners", async ({
  page,
}, testInfo) => {
  await page.goto("/league/42/scores");
  await expect(
    page.getByRole("heading", { name: "Scores", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Arsenal versus Manchester City, Live" })
    .click();
  await expect(page).toHaveURL(/fixture=1/);
  const team = page.getByRole("region", {
    name: "Arsenal players",
    exact: true,
  });
  const bench = page.getByRole("region", {
    name: "Arsenal substitutes",
    exact: true,
  });
  const pitch = page.locator(".scores-pitch");
  await expect(pitch).toHaveCount(1);
  await expect(pitch.locator(".scores-player")).toHaveCount(22);
  await expect(
    pitch
      .locator(".scores-pitch__half")
      .first()
      .locator(".scores-pitch__row")
      .first(),
  ).toContainText("Raya");
  await expect(
    pitch
      .locator(".scores-pitch__half")
      .last()
      .locator(".scores-pitch__row")
      .last(),
  ).toContainText("Donnarumma");
  const pitchBox = await pitch.boundingBox();
  const benchesBox = await page.locator(".scores-benches").boundingBox();
  expect(benchesBox!.y).toBeGreaterThanOrEqual(pitchBox!.y + pitchBox!.height);
  await expect(team.locator(".scores-player")).toHaveCount(11);
  await expect(bench.locator(".scores-subs .scores-substitute")).toHaveCount(2);
  await expect(team).not.toContainText("Trossard");
  await expect(bench.locator(".scores-subs")).toContainText("Trossard");
  await expect(bench.locator(".scores-subs")).toContainText("18 min played");
  await expect(
    bench.locator(".scores-substitute").filter({ hasText: "Nwaneri" }),
  ).toContainText("1");
  await expect(team).not.toContainText("White");
  await expect(team.getByRole("link", { name: /^Saka,/ })).toHaveAccessibleName(
    /10 points, substituted off after 72 minutes, 1 goal, 1 assist/,
  );
  await expect(
    team.locator(".scores-player__subbed-off").first(),
  ).toContainText("72′");
  await expect(team.locator(".scores-player__link > small")).toHaveCount(0);
  await expect(team.locator(".squad-player__label").first()).toContainText("2");
  await expect(
    team
      .getByRole("link", { name: /^Raya,/ })
      .locator(".scores-player__subbed-off"),
  ).toHaveCount(0);
  await team
    .getByRole("button", { name: "Show 1 active owners of Saka" })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Alex Manager");
  await expect(page.getByRole("dialog")).toContainText("Captain");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  if (testInfo.project.name === "mobile") {
    await expect(
      page.getByRole("button", { name: "Manchester City", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("region", { name: "Arsenal players" }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: "Manchester City players" }),
    ).toBeVisible();
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: testInfo.outputPath("scores.png"),
    fullPage: true,
  });
  await page.goBack();
  await expect(page).not.toHaveURL(/fixture=/);
  await page
    .getByRole("button", { name: "Manchester City versus Arsenal, Upcoming" })
    .click();
  await expect(
    page.locator(".scores-pitch__empty").filter({ visible: true }).first(),
  ).toContainText("Lineup not available yet");
  await expect(page.locator(".scores-match-header")).toContainText("vs");
});

test("unconfirmed participants never become guessed starters", async ({
  page,
}) => {
  await page.route("**/api/v1/leagues/42/live", (route) =>
    route.fulfill({
      json: {
        ...live,
        players: live.players.map((player) => ({
          ...player,
          fixtures: player.fixtures.map((fixture) => ({
            ...fixture,
            starts: null,
          })),
        })),
      },
    }),
  );
  await page.goto("/league/42/scores?fixture=1");
  const team = page.getByRole("region", {
    name: "Arsenal players",
    exact: true,
  });
  await expect(team).toContainText("Waiting for lineup data");
  await expect(
    page.getByRole("region", { name: "Arsenal substitutes", exact: true }),
  ).toContainText("Awaiting lineup confirmation");
  await expect(team.locator(".scores-player")).toHaveCount(0);
});

test("scores fits narrow phones and tablet navigation", async ({ page }) => {
  await page.goto("/league/42/scores?fixture=1");
  await expect(
    page.getByRole("heading", { name: "Scores", exact: true }),
  ).toBeVisible();
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const nav =
      width < 768
        ? page.getByRole("navigation", { name: "Main navigation" })
        : page.locator(".league-desktop-nav");
    await expect(
      nav.getByRole("link", { name: "Scores", exact: true }),
    ).toBeVisible();
  }
});

for (const formation of [[1, 4, 5, 1], [1, 3, 6, 1], [1, 5, 3, 2]]) {
  test(`pitch cards contain their badges in ${formation.join("-")} rows`, async ({ page }, testInfo) => {
    const positions = formation.flatMap((count, index) => Array<number>(count).fill(index + 1));
    await page.route("**/api/v1/context", (route) => route.fulfill({
      json: {
        ...context,
        players: players.map((player, index) => ({
          ...player,
          element_type: positions[index % 14] ?? 3,
        })),
      },
    }));
    await page.route("**/api/v1/leagues/42", (route) => route.fulfill({
      json: {
        ...league,
        managers: Array.from({ length: 50 }, (_, index) => ({
          ...league.managers[0],
          entry: index + 1,
          activePicks: players.map((player) => ({ ...picks[0], element: player.id })),
        })),
      },
    }));
    await page.route("**/api/v1/leagues/42/live", (route) => route.fulfill({
      json: {
        ...live,
        players: live.players.map((player) => ({
          ...player,
          fixtures: player.fixtures.map((fixture) => ({
            ...fixture,
            stats: [
              ...fixture.stats.filter((stat) => stat.identifier === "minutes"),
              { identifier: "goals_scored", points: 15, value: 3 },
              { identifier: "assists", points: 6, value: 2 },
              { identifier: "yellow_cards", points: -1, value: 1 },
            ],
          })),
        })),
      },
    }));
    await page.goto("/league/42/scores?fixture=1");
    await expect(page.locator(".scores-player")).toHaveCount(22);
    for (const width of [320, 375, 430, 600, 767, 768, 820, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const problems = await page.locator(".scores-pitch").evaluate((pitch) => {
        const issues: string[] = [];
        const pitchRect = pitch.getBoundingClientRect();
        const cards = [...pitch.querySelectorAll(".scores-player")];
        for (const card of cards) {
          const rect = card.getBoundingClientRect();
          if (rect.height > 120) issues.push("player card is no longer compact");
          const name = card.querySelector("strong")?.textContent;
          if (rect.left < pitchRect.left || rect.right > pitchRect.right) issues.push(`${name} outside pitch`);
          for (const part of card.querySelectorAll("img, .squad-player__label, .scores-player__subbed-off, .scores-player__owners, .player-event")) {
            const bounds = part.getBoundingClientRect();
            if (bounds.left < rect.left - 1 || bounds.right > rect.right + 1 || bounds.top < rect.top - 1 || bounds.bottom > rect.bottom + 1) {
              issues.push(`${name}: ${part.className} outside card`);
            }
          }
          for (const other of cards) {
            if (other === card) continue;
            const otherRect = other.getBoundingClientRect();
            if (rect.left < otherRect.right - 1 && rect.right > otherRect.left + 1 && rect.top < otherRect.bottom - 1 && rect.bottom > otherRect.top + 1) {
              issues.push(`${name} overlaps another card`);
            }
          }
        }
        if (document.documentElement.scrollWidth > innerWidth) issues.push("page overflows viewport");
        return issues;
      });
      expect(problems, `${width}px viewport`).toEqual([]);
      const ownerButton = page.getByRole("button", { name: "Show 50 active owners of Martinelli" });
      await ownerButton.click();
      await expect(page.getByRole("dialog")).toContainText("Martinelli");
      await page.keyboard.press("Escape");
      if (formation[2] === 5 && [320, 768, 1440].includes(width)) {
        await page.locator(".scores-pitch__half").first().screenshot({ path: testInfo.outputPath(`pitch-${width}.png`), style: ".league-header, .league-bottom-nav { visibility: hidden !important; }" });
      }
    }
  });
}
