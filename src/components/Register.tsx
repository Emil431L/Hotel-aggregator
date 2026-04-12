import { useState } from "react"
import { useRegister } from "../hooks/useRegister"

const Register = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const { register, isLoading } = useRegister()

    const handleSubmit = async (e: React.FormEvent) => {
        if (!email || !password) {
            alert("Email and password are required")
            return
        }

        e.preventDefault()
        register({email, password})
    }

    return (
        <div>
            <h2>Registration</h2>
            <form onSubmit={handleSubmit}>
                <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                />
                <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="pass"
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Sign in"}
                </button>
                <button>Login</button>
            </form>
        </div>
    )
}

export default Register