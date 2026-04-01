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




import axios from "axios";
import { createClient } from "redis";

// Создаём клиента Redis
const redis = createClient({
  url: process.env.REDIS_URL,
});

// Безопасное подключение Redis
let isRedisConnected = false;
redis.connect()
  .then(() => {
    isRedisConnected = true;
    console.log("✅ Redis connected successfully");
  })
  .catch((err) => {
    console.error("❌ Redis connection failed:", err);
  });

export default async function handler(req, res) {
  console.log("🔹 Handler started");

  // Проверка REDIS_URL
  console.log("REDIS_URL:", process.env.REDIS_URL);

  const { city } = req.query;
  console.log("Query parameter city:", city);

  if (!city) {
    console.warn("⚠️ City query parameter is missing");
    return res.status(400).json({ message: "City required" });
  }

  const cacheKey = `hotels:${city.toLowerCase().trim()}`;
  console.log("Cache key:", cacheKey);

  try {
    let cachedHotels = null;

    // Проверяем, подключён ли Redis
    if (isRedisConnected) {
      console.log("Checking Redis cache...");
      cachedHotels = await redis.get(cacheKey);
      console.log("Cached data from Redis:", cachedHotels);
    } else {
      console.warn("Redis not connected, skipping cache");
    }

    if (cachedHotels) {
      try {
        const parsed = JSON.parse(cachedHotels);
        console.log(`City ${city} returned from Redis 🚀`);
        return res.status(200).json(parsed);
      } catch (err) {
        console.error("❌ Failed to parse cached data:", err);
      }
    } else {
      console.log("No cached data, fetching from API...");
    }

    // Запрос к внешнему API
    const response = await axios.get("https://api.hotels-api.com/v1/hotels/search", {
      params: { city, limit: 10 },
      headers: { "X-API-KEY": process.env.API_KEY },
      timeout: 5000, // таймаут на 5 секунд
    });
    console.log("API response received");

    const hotels = response.data.data || [];
    console.log("Hotels fetched:", hotels.length);

    // Сохраняем в Redis, если соединение есть
    if (isRedisConnected) {
      try {
        await redis.set(cacheKey, JSON.stringify(hotels), { EX: 1296000 });
        console.log("Hotels cached in Redis ✅");
      } catch (err) {
        console.error("❌ Failed to set data in Redis:", err);
      }
    }

    res.status(200).json(hotels);
  } catch (err) {
    console.error("FULL ERROR:", err.response?.data || err.message || err);
    res.status(500).json({ message: "Server error" });
  }
}