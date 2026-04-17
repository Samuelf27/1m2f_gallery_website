"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import AdminSidebar from "./AdminSidebar"

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === "/admin/login"
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (isLogin) return
    document.body.classList.add("admin-mode")
    return () => document.body.classList.remove("admin-mode")
  }, [isLogin])

  if (isLogin) return <>{children}</>

  return (
    <div className="adminShell">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          className="adminSidebarOverlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <main className="adminMain">
        <button
          type="button"
          className="adminMobileMenuBtn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menu"
        >
          <span /><span /><span />
        </button>
        {children}
      </main>
    </div>
  )
}