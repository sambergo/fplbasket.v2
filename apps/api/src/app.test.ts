import { afterEach, describe, expect, it } from "vitest";
import { buildApp } from "./app.js";

describe("API contracts", () => {
  const apps: ReturnType<typeof buildApp>[] = [];
  afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close())));

  it("redirects legacy shared links to the league overview", async () => {
    const app = buildApp(); apps.push(app);
    const response = await app.inject({ method: "GET", url: "/id/12345" });
    expect(response.statusCode).toBe(301);
    expect(response.headers.location).toBe("/league/12345/overview");
  });

  it("rejects invalid legacy league IDs", async () => {
    const app = buildApp(); apps.push(app);
    const response = await app.inject({ method: "GET", url: "/id/not-a-number" });
    expect(response.statusCode).toBe(400);
  });

  it("returns health metadata", async () => {
    const app = buildApp(); apps.push(app);
    const response = await app.inject({ method: "GET", url: "/api/v1/health" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ status: "ok", upstream: "configured" });
  });

  it("rejects invalid league IDs with the standard error shape", async () => {
    const app = buildApp(); apps.push(app);
    const response = await app.inject({ method: "GET", url: "/api/v1/leagues/not-a-number" });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ code: "INVALID_REQUEST", message: "The request is invalid" });
  });
});
