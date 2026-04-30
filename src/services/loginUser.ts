import api from "./api"

interface LoginUser {
    email: string,
    password: string
}

export const loginUser = async (userData: LoginUser): Promise<any> => {
    const res = await api.post("/login", userData)

    return res.data
}