const express = require("express")
const cors = require("cors")
const routes = require("./routes/router")
const connectDB = require("./config/db") 

const app = express()

connectDB() 

app.use(express.json())

const allowedOrigins = [
    "https://hotel-aggregator-sigma.vercel.app",
    "http://localhost:3000"
]

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true
}))

app.use("/api", routes)

module.exports = app

if (process.env.NODE_ENV !== 'production') {
    const PORT = 5000
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`)
    })
}
