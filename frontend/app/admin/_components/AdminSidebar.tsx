"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { logoutAction } from "@/app/admin/actions"

const navItems = [
  {
    section: "Principal",
    links: [
      { href: "/admin", label: "Dashboard", icon: "◈", exact: true },
    ],
  },
  {
    section: "Conteúdo",
    links: [
      { href: "/admin/artworks", label: "Obras", icon: "◻" },
      { href: "/admin/exposicoes", label: "Exposições", icon: "◇" },
      { href: "/admin/depoimentos", label: "Depoimentos", icon: "◎" },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="adminSidebar">
      <div className="adminSidebarHeader">
        <Link href="/admin" className="adminSidebarLogo">
          1M2F
        </Link>
        <span className="adminSidebarTag">Admin</span>
      </div>

      <nav className="adminNav">
        {navItems.map((group) => (
          <div key={group.section} className="adminNavGroup">
            <span className="adminNavSection">{group.section}</span>
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`adminNavLink ${isActive(link.href, link.exact) ? "adminNavLink--active" : ""}`}
              >
                <span className="adminNavIcon">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="adminSidebarFooter">
        <Link
          href="/"
          target="_blank"
          className="adminNavLink adminNavLink--muted"
        >
          <span className="adminNavIcon">↗</span>
          Ver site
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="adminNavLink adminNavLink--logout">
            <span className="adminNavIcon">→</span>
            Sair
          </button>
        </form>
      </div>
    </aside>
  )
}