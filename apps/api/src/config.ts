import { z } from "zod";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

// Resolve from this module so both source and compiled startup use the root file.
try {
  loadEnvFile(fileURLToPath(new URL("../../../.env", import.meta.url)));
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
}

const configSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3637),
  HOST: z.string().default("0.0.0.0"),
  LOG_LEVEL: z.string().default("info"),
  FPL_BASE_URL: z.string().url().default("https://fantasy.premierleague.com/api"),
  FPL_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
  CACHE_MAX_ENTRIES: z.coerce.number().int().positive().default(5_000),
  ALLOWED_ORIGIN: z.string().default("http://localhost:5173"),
});

export const config = configSchema.parse(process.env);
