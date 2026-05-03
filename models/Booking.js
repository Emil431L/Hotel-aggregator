import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    hotelId: { type: String, required: true },
    hotelName: { type: String, required: true },
    bookedAt: { type: Date, default: Date.now }
})

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema)