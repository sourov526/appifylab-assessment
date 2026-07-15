import { config } from "dotenv";
import { resolve } from "node:path";
import { z } from "zod";

const rootEnvPath = resolve(
  process.cwd(),
  process.env.NODE_ENV === "production" ? "../.env.production" : "../.env.local"
);

config({ path: rootEnvPath });
config();

const booleanFromEnv = z.preprocess((value) => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true") {
      return true;
    }

    if (normalized === "false") {
      return false;
    }
  }

  return value;
}, z.boolean());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  CLIENT_ORIGIN: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(16),
  SESSION_COOKIE_NAME: z.string().default("appifylab.sid"),
  SESSION_COOKIE_SECURE: booleanFromEnv.default(false),
  SESSION_MAX_AGE_MS: z.coerce.number().default(1000 * 60 * 60 * 24 * 7),
  UPLOAD_DIR: z.string().default("uploads")
});

export const env = envSchema.parse(process.env);
