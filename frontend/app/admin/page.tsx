"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Admin() {
  const router = useRouter()

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin")

    if (!isAdmin) {
      router.push("/admin/login")
    }
  }, [])

  return (
    <div className="adminDashboard">
      <h1>Painel Admin</h1>

      <a href="/admin/artworks">Gerenciar Obras</a>
    </div>
  )
}