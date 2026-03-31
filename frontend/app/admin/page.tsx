"use client"

import { useRouter } from "next/navigation"

export default function Admin() {
  const router = useRouter()

  function handleLogout() {
    // Remove o cookie
    document.cookie = "admin=; path=/; max-age=0"
    router.push("/admin/login")
  }

  return (
    <div className="adminDashboard">
      <h1>Painel Admin</h1>

      <a href="/admin/artworks" className="adminButton">
        Gerenciar Obras
      </a>

      <button onClick={handleLogout} className="logoutButton">
        Sair
      </button>
    </div>
  )
}
