export interface TypeError {
    title: string,
    message: string,
    type: string
}

export const parseError = (err: any): TypeError => {
    if (!err.response) {
        return {
            title: "Error",
            message: "Unable to reach server. Check your internet connection",
            type: "OFFLINE"
        }
    }

    else {
        const status = err.status

        return {
            title: status >= 500 ? "Server Error" : "Attention",
            message: err.response?.data?.message || "Something went wrong",
            type: "ONLINE"
        }
    }
}