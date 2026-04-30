import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLogin } from "../hooks/useLogin"

const Login = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const { login, response, isLoading, error } = useLogin()

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            alert("Email and password are required")
            return
        }

        try {
            const result = await login({email, password})

            if (result) {
                setEmail("")
                setPassword("")
                navigate("/hotel")
            }
        } 
        catch (err) {
            console.error(err)
        }
    }

    const Register = () => {
        navigate("/register")
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Login"}
                </button>
                <button type="button" onClick={Register}>Register</button>

                {error && (
                    <div>
                        <h3>{error.title}</h3>
                        <p>{error.message}</p>
                        {error.type === "OFFLINE" && (
                            <button onClick={() => login({ email, password })}>Try again</button>
                        )}
                    </div>
                )}
            </form>

            {response && <p>{response.message}</p>}
        </div>
    )
}

export default Login