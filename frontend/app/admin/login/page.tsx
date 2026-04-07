"use client"

import { useState } from "react"
import { loginAction } from "../actions"

export default function Login() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await loginAction(password)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // Se não retornou erro, o server action fez redirect — não precisa fazer nada
  }

  return (
    <div className="adminLogin">
      <form onSubmit={handleLogin} className="adminForm">
        <h2>Admin Login</h2>

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError(null)
          }}
        />

        {error && <p className="errorMessage">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  )
}
