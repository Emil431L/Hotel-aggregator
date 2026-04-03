import { createClient } from "redis"

let redisClient

export async function getRedisClient() {
    if (!redisClient) {
        redisClient = createClient({ url: process.env.REDIS_URL })

        redisClient.on('error', (err) => console.error("Redis Error:", err))

        await redisClient.connect()
    }

    return redisClient
}