import api from "./api"
import { Hotels } from "../types/hotels"

export const getHotels = async (
    city: string
): Promise<Hotels[]> => {
    const res = await api.get<Hotels[]>("/get-hotels", {
        params: {
            city
        }
    })

    return res.data
}