"use client"

import { usePathname } from "next/navigation"
import AdminSidebar from "./AdminSidebar"

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === "/admin/login"

  if (isLogin) return <>{children}</>

  return (
    <div className="adminShell">
      <AdminSidebar />
      <main className="adminMain">{children}</main>
    </div>
  )
}