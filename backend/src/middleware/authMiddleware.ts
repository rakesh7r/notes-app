import { Request, Response, NextFunction } from "express"
import { OAuth2Client } from "google-auth-library"

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID)

export interface AuthRequest extends Request {
    user?: any
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.sendStatus(401)
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.VITE_GOOGLE_CLIENT_ID,
        })
        const payload = ticket.getPayload()

        if (!payload) {
            return res.sendStatus(403)
        }

        req.user = payload
        next()
    } catch (error) {
        console.error("Token verification failed:", error)
        return res.sendStatus(403)
    }
}
