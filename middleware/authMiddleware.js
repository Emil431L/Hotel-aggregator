import jwt from "jsonwebtoken"

function parseCookies(cookieString) {
  const cookies = {}

  cookieString?.split(";").forEach(cookie => {
    const [key, value] = cookie.trim().split("=")
    cookies[key] = value
  })

  return cookies
}

export function authMiddleware(req) {
  try {
    const cookies = parseCookies(req.headers.cookie)
    const token = cookies.token

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    return decoded
  } catch (err) {
    return null
  }
}