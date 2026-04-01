import axios from "axios";
import { kv } from "@vercel/kv"

export default async function handler(req, res) {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: "City required" });
  }

  const cacheKey = `hotels:${city.toLowercase().trim()}`

  try {
    const cacheHotels = await kv.get(cacheKey)

    if (cacheHotels) {
      console.log("City ${city} returned from cache Vercel KV 🚀")
      return res.status(200).json(cacheHotels)
    }

    const response = await axios.get("https://api.hotels-api.com/v1/hotels/search", {
      params: { city, limit: 10 },
      headers: {
        "X-API-KEY": process.env.API_KEY,
      },
    });

    const hotels = response.data.data

    await kv.set(cacheKey, hotels, { ex: 1296000 })

    res.status(200).json(hotels);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Server error" });
  }
}

