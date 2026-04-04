import { getRedisClient } from "../lib/redis"
import axios from "axios"

export default async function handler(req, res) {
  const { city } = req.query
  if (!city) return res.status(400).json({ message: "City required" });

  try {
    const redis = await getRedisClient()

    const normalizedCity = city.toLowerCase().trim().replace(/\s+/g, "-")
    const cacheKey = `hotels:${normalizedCity}`

    const cached = await redis.get(cacheKey)

    if (cached) {
      console.log(`City ${city} from cache`)
      return res.status(200).json(JSON.parse(cached))
    }

    const response = await axios.get(
      "https://api.hotels-api.com/v1/hotels/search",
      {
        params: { city, limit: 10 },
        headers: { "X-API-KEY": process.env.API_KEY },
        timeout: 5000
      }
    );

    if (!response.data?.data) {
      throw new Error("Invalid API response")
    }

    const hotels = response.data.data || []

    await redis.set(cacheKey, JSON.stringify(hotels), { EX: 648000 })

    return res.status(200).json(hotels)

  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message)
    return res.status(500).json({ message: "Server error" })
  }
}