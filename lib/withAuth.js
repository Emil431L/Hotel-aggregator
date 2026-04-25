import jwt from "jsonwebtoken"
import * as cookie from "cookie"

export const withAuth = (handler) => {
    return async (req, res) => {
        const cookies = cookie.parse(req.headers.cookie || '')
        const token = cookies.token

        if (!token) {
            return res.status(401).json({ message: "Token missing" })
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.userId = decoded.userId

            return handler(req, res)
        } catch (err) {
            console.error(err)
            return res.status(401).json({ message: "Invalid or expired token" })
        }
    }
}