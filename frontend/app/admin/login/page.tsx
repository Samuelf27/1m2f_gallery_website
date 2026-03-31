"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem("admin", "true")
      router.push("/admin")
    } else {
      setError("Senha incorreta. Tente novamente.")
    }
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

        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}
