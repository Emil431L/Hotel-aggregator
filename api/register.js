import { connectDB } from "../lib/db"
import { User } from "../models/User"
import bcrypt from "bcrypt"

export default async function register(req, res) {
    if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({message: "Email and password are required"})
    }

    try {
        await connectDB()

        const condidate = await User.findOne({email})

        if (condidate) {
            return res.status(404).json({message: "Email already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            email,
            password
        })

        await newUser.save()

        return res.status(200).json({message: "User sucessfully registered"})
    } catch (err) {
        console.error(err)
        return res.status(500).json({message: "Server Error"})
    }
}