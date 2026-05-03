import { connectDB } from "../lib/db";
import Booking from "../models/Booking";
import { withAuth } from "../lib/withAuth";

async function handler(req, res) {
    try {
        await connectDB()
        
        const bookings = await Booking.find({userId: req.userId})

        return res.status(200).json(bookings)
    } catch (err) {
        console.error(err)
        return res.status(500).json({message: "Server error"})
    }
}

export default withAuth(handler)