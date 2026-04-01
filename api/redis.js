import { createClient } from "redis";
import "dotenv/config";

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

const keys = await redis.keys("hotels:*");
console.log("All keys:", keys);

for (const key of keys) {
  const value = await redis.get(key);
  console.log(key, JSON.parse(value));
}

await redis.disconnect();