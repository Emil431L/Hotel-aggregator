import { useMutation } from "@tanstack/react-query"
import { parseError } from "../utils/errHandle"
import { registerUser } from "../services/registerUser"

export const useRegister = () => {
    const mutation = useMutation({
        mutationFn: registerUser
    })

    return {
        register: mutation.mutateAsync,
        response: mutation.data,
        isLoading: mutation.isPending,
        error: mutation.error ? parseError(mutation.error) : null
    }
}