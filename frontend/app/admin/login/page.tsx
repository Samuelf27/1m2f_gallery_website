"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
  const [password, setPassword] = useState("")
  const router = useRouter()

  function handleLogin(e: any) {
    e.preventDefault()

    if (password === "admin123") {
      localStorage.setItem("admin", "true")
      router.push("/admin")
    } else {
      alert("Senha incorreta")
    }
  }

  return (
    <div className="adminLogin">
      <form onSubmit={handleLogin}>
        <h2>Admin Login</h2>

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Entrar</button>
      </form>
    </div>
  )
}