import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  CLIENT_ORIGIN: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(16),
  SESSION_COOKIE_NAME: z.string().default("appifylab.sid"),
  SESSION_COOKIE_SECURE: z.coerce.boolean().default(false),
  SESSION_MAX_AGE_MS: z.coerce.number().default(1000 * 60 * 60 * 24 * 7),
  UPLOAD_DIR: z.string().default("uploads")
});

export const env = envSchema.parse(process.env);
