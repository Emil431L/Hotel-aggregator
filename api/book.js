import { connectDB } from "../lib/db"
import Booking from "../models/Booking"
import { withAuth } from "../lib/withAuth"

async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({message: "Method not allowed"})
    }

    try {
        await connectDB()

        const {hotelId, hotelName} = req.body

        if (!hotelId || !hotelName) {
            return res.status(400).json({message: "Missing data"})
        }

        const booking = new Booking({
            userId: req.userId,
            hotelId,
            hotelName,
        })

        await booking.save()
        return res.status(200)
        
    } catch (err) {
        console.error(err)
        return res.status(500).json({message: "Server error"})
    }
}

export default withAuth(handler)