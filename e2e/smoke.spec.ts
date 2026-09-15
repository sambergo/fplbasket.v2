import { expect, test } from "@playwright/test";

test("landing accepts a league ID without asking for a gameweek", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "GO!", exact: true })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "League ID", exact: true })).toBeVisible();
  await expect(page.getByText(/gameweek selector/i)).toHaveCount(0);
});

test("unknown routes show a useful error", async ({ page }) => {
  await page.goto("/not-a-route");
  await expect(page.getByText("Couldn’t load this view")).toBeVisible();
});

test("legacy shared links redirect and the new deep link serves the SPA", async ({ request }) => {
  const legacy = await request.get("/id/12345", { maxRedirects: 0 });
  expect(legacy.status()).toBe(301);
  expect(legacy.headers().location).toBe("/league/12345/overview");
  const overview = await request.get(legacy.headers().location!);
  expect(overview.status()).toBe(200);
  expect(overview.headers()["content-type"]).toContain("text/html");
  expect(await overview.text()).toContain('<div id="root">');
});

for (const path of ["/id/12345", "/id/12345/"]) {
  test(`legacy link ${path} redirects at the server`, async ({ request }) => {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(response.headers().location).toBe("/league/12345/overview");
  });

  test(`legacy link ${path} redirects when the SPA handles it`, async ({ page, request }) => {
    // Simulate a cached SPA response or a static server bypassing the API redirect.
    const html = await (await request.get("/")).text();
    await page.route(`**${path}`, (route) => route.fulfill({ contentType: "text/html", body: html }));
    await page.route("**/api/v1/**", (route) => route.fulfill({
      status: 503, contentType: "application/json",
      body: JSON.stringify({ code: "UPSTREAM_UNAVAILABLE", message: "Test upstream unavailable" }),
    }));
    await page.goto(path);
    await expect(page).toHaveURL(/\/league\/12345\/overview$/);
  });
}
