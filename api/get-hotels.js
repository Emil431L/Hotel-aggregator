// import axios from "axios";
// import { createClient } from "redis";

// const redis = createClient({
//   url: process.env.REDIS_URL,
// });

// await redis.connect();

// export default async function handler(req, res) {
//   const { city } = req.query;

//   if (!city) {
//     return res.status(400).json({ message: "City required" });
//   }

//   const cacheKey = `hotels:${city.toLowerCase().trim()}`;

//   try {
//     const cachedHotels = await redis.get(cacheKey);

//     if (cachedHotels) {
//       console.log(`City ${city} returned from Redis 🚀`);
//       return res.status(200).json(JSON.parse(cachedHotels));
//     }

//     const response = await axios.get("https://api.hotels-api.com/v1/hotels/search", {
//       params: { city, limit: 10 },
//       headers: {
//         "X-API-KEY": process.env.API_KEY,
//       },
//     });

//     const hotels = response.data.data || [];

//     await redis.set(cacheKey, JSON.stringify(hotels), {
//       EX: 1296000,
//     });

//     res.status(200).json(hotels);
//   } catch (err) {
//     console.error("FULL ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// }






import { createClient } from "redis";
import axios from "axios";

export default async function handler(req, res) {
  const { city } = req.query;

  if (!city) return res.status(400).json({ message: "City required" });

  const redis = createClient({ url: process.env.REDIS_URL });
  try {
    await redis.connect();

    const cacheKey = `hotels:${city.toLowerCase().trim()}`;
    const cachedHotels = await redis.get(cacheKey);

    if (cachedHotels) {
      console.log(`City ${city} returned from Redis 🚀`);
      await redis.disconnect();
      return res.status(200).json(JSON.parse(cachedHotels));
    }

    console.log(`Fetching hotels for city: ${city} from API...`);
    const response = await axios.get("https://api.hotels-api.com/v1/hotels/search", {
      params: { city, limit: 10 },
      headers: { "X-API-KEY": process.env.API_KEY },
    });

    const hotels = response.data.data || [];
    await redis.set(cacheKey, JSON.stringify(hotels), { EX: 1296000 });
    console.log(`Hotels for ${city} cached in Redis.`);

    await redis.disconnect();
    return res.status(200).json(hotels);

  } catch (err) {
    console.error("FULL ERROR:", err.response?.data || err.message || err);
    try { await redis.disconnect(); } catch {}
    return res.status(500).json({ message: "Server error" });
  }
}