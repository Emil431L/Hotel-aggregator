import { connectDB } from "../lib/db"
import User from "../models/User"
import jwt from "jsonwebtoken"

export default async function login(req, res) {
    if (req.method !== "POST") {
        return res.status(400).json({message: "Method not allowed"})
    }

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(401).json({message: "Email and password are required"})
    }

    try {
        await connectDB()

        const candidate = await User.findOne({email})

        if (!candidate) {
            return res.status(404).json({message: "User not found"})
        }

        const isMatch = await bcrypt.compare(password, candidate.password)

        if (!isMatch) {
            return res.status(401).json({message: "Invalid credentials"})
        }

        const token = jwt.sign({userId: candidate._id}, process.env.JWT_SECRET, {expiresIn: "1h"})

        res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`)

        return res.status(200).json({message: "Login successfully"})
    } 
    catch (err) {
        console.error(err)
        return res.status(500).json({message: "Server error"})
    }
}

