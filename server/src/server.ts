import { app } from "./app.js";
import { prisma } from "./config/db.js";
import { env } from "./config/env.js";
import { redisClient } from "./config/redis.js";

async function main() {
  await prisma.$connect();
  await redisClient.connect();

  app.listen(env.PORT, () => {
    console.log(`Server listening on http://localhost:${env.PORT}`);
  });
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
  process.exit(1);
});
