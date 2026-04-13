export interface TypeError {
    title: string,
    message: string,
    type: string
}

export const parseError = (err: any): TypeError => {
    if (!err?.response) {
        return {
            title: "Network Error",
            message: "Unable to reach server. Check your internet connection",
            type: "OFFLINE"
        }
    }

    const status = err.response?.status

    const message = err.response?.data?.message || "Something went wrong"

    return {
        title: status >= 500 ? "Server Error" : "Request Error",
        message,
        type: "ONLINE"
    }
}