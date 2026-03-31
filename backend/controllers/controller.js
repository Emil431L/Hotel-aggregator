const axios = require("axios");

const handler = (req, res) => {
  res.send("Hotels list");
};

const getHotels = async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ message: "City required" });

  try {
    const response = await axios.get("https://api.hotels-api.com/v1/hotels/search", {
      params: { city, limit: 10 },
      headers: { "X-API-KEY": process.env.API_KEY }
    });
    res.status(200).json(response.data.data);
  } catch (err) {
    console.error(err.response?.data?.message || err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { handler, getHotels };