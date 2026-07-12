import { createClient } from "redis";
import RedisStore from "connect-redis";
import { env } from "./env.js";

export const redisClient = createClient({
  url: env.REDIS_URL
});

redisClient.on("error", (error) => {
  console.error("Redis error", error);
});

export const sessionStore = new RedisStore({
  client: redisClient,
  prefix: "appifylab:"
});
