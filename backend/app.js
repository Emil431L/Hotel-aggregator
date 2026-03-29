const express = require("express")
const cors = require("cors")
const routes = require("./routes/router")

const app = express()

app.use(express.json())

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use("/api", routes)

module.exports = app