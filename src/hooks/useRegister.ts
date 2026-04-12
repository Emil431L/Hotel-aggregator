import { useMutation } from "@tanstack/react-query"
import { registerUser } from "../services/registerUser"

export const useRegister = () => {
    const mutation = useMutation({
        mutationFn: registerUser
    })

    return {
        register: mutation.mutate,
        isLoading: mutation.isPending,
    }
}