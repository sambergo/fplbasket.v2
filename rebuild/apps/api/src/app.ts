import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { leagueIdSchema } from "@fpl-basket/contracts";
import { config } from "./config.js";
import { AppError } from "./errors.js";
import { getContext } from "./fpl.js";
import { getLeague, getLive } from "./services.js";

export function buildApp() {
  const app = Fastify({ logger: { level: config.LOG_LEVEL } });
  app.register(cors, { origin: config.ALLOWED_ORIGIN.split(",").map((item) => item.trim()) });
  app.get("/api/v1/health", async () => ({ status: "ok", upstream: "configured", checkedAt: new Date().toISOString() }));
  app.get("/api/v1/context", getContext);
  app.get<{ Params: { leagueId: string } }>("/api/v1/leagues/:leagueId", async (request) => getLeague(leagueIdSchema.parse(request.params.leagueId)));
  app.get<{ Params: { leagueId: string } }>("/api/v1/leagues/:leagueId/live", async (request) => getLive(leagueIdSchema.parse(request.params.leagueId)));

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) return reply.status(error.status).send({ code: error.code, message: error.message, ...(error.details ? { details: error.details } : {}) });
    if (error instanceof Error && error.name === "ZodError") return reply.status(400).send({ code: "INVALID_REQUEST", message: "The request is invalid" });
    app.log.error(error);
    return reply.status(500).send({ code: "INTERNAL_ERROR", message: "Something went wrong" });
  });

  const assets = resolve(dirname(fileURLToPath(import.meta.url)), "../../web/dist");
  if (existsSync(assets)) {
    app.register(fastifyStatic, { root: assets, wildcard: false });
    app.setNotFoundHandler((request, reply) => request.url.startsWith("/api/")
      ? reply.status(404).send({ code: "NOT_FOUND", message: "API route not found" })
      : reply.sendFile("index.html"));
  }
  return app;
}
