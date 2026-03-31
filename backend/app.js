const express = require("express")
const { handler, getHotels } = require("./controllers/controller")
const cors = require("cors")

const app = express()
app.use(express.json())

app.use(cors({ origin: true, credentials: true })) 

app.get("/", handler)
app.get("/api/get-hotels", getHotels)

module.exports = app