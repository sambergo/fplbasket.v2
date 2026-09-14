import { expect, test } from "@playwright/test";

test("landing accepts a league ID without asking for a gameweek", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /your mini-league/i })).toBeVisible();
  await expect(page.getByLabel("League ID")).toBeVisible();
  await expect(page.getByText(/gameweek selector/i)).toHaveCount(0);
});

test("unknown routes show a useful error", async ({ page }) => {
  await page.goto("/not-a-route");
  await expect(page.getByText("Couldn’t load this view")).toBeVisible();
});
