import { connectDB } from "../lib/db"
import { User } from "../models/User"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function register (req, res) {
    if (req.method !== "POST") {
        return res.status(400).json({message: "Method not allowed"})
    }

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(401).json({message: "Email and password"})
    }

    try {
        await connectDB()

        const candidate = await User.findOne({email})

        if (candidate) {
            return res.status(409).json({message: "Email already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            email,
            password: hashedPassword
        })

        await newUser.save()

        const token = jwt.sign({userId: newUser._id, email: newUser.email}, process.env.JWT_SECRET, { expiresIn: "1h"})

        res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`)

        return res.status(200).json({message: "User registered sucessfully"})
    } catch (err) {
        console.error(err)
        return res.status(500).json({message: "Server Error"})
    }
}