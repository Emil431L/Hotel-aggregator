import api from "./api"

interface RegisterUser {
    email: string,
    password: string
}

export const registerUser = async (userData: RegisterUser): Promise<any> => {
    const res = await api.post("/register", userData)

    return res.data
}