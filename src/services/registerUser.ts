import api from "./api"

interface RegisterData {
    email: string,
    password: string
}

export const registerUser = async (userData: RegisterData): Promise<any> => {
    const res = await api.post<any>("/register", userData)

    return res.data
}