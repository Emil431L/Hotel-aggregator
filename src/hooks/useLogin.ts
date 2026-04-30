import { useMutation } from "@tanstack/react-query";
import { parseError } from "../utils/errHandle";
import { loginUser } from "../services/loginUser";

export const useLogin = () => {
    const mutation = useMutation({
        mutationFn: loginUser
    })

    return {
        login: mutation.mutateAsync,
        response: mutation.data,
        isLoading: mutation.isPending,
        error: mutation.error ? parseError(mutation.error) : null
    }
}