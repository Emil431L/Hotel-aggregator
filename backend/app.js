const express = require("express")
const cors = require("cors")
const routes = require("./routes/router")

const app = express()

app.use(express.json())

const allowedOrigins = [
    "https://hotel-aggregator-sigma.vercel.app"
]

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
    }
    else {
        callback(new Error("Not allowed by CORS"))
    }
},
    credentials: true
}))

app.use("/api", routes)

module.exports = app