import authMiddleware from "../middleware/authMiddleware";

export async function profile(req, res) {
    const user = authMiddleware(req)

    if (!user) {
        return res.status(401).json({message: "Unauthorized"})
    }

    return res.status(200)
}