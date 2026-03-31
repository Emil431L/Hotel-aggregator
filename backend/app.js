const express = require("express");
const cors = require("cors");
const { handler, getHotels } = require("./controllers/controller");

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.get("/", handler);
app.get("/api/get-hotels", getHotels);

module.exports = app;