import { useState } from "react"
import { useRegister } from "../hooks/useRegister"
import { useNavigate } from "react-router-dom"

const Register = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { register, response, isLoading, error } = useRegister()

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            alert("Email and password are required")
            return
        }

        try {
            const result = await register({ email, password })

            if (result || !error) {
            setEmail("")
            setPassword("")
            navigate("/hotel")
        }
        } catch (err) {
        console.log(err)
        }
    }

    const Login = () => {
        navigate("/login")
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                />

                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter your password"
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Sign in"}
                </button>
                <button onClick={Login}>Login</button>

                {error && (
                    <div>
                        <h3>{error.title}</h3>
                        <p>{error.message}</p>
                        {error.type === "OFFLINE" && (
                            <button onClick={() => register({ email, password })}></button>
                            )}
                            </div>
                        )}
                        </form>

            {response && <p>{response.message}</p>}
        </div>
    )
}

export default Register