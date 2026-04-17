"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { logoutAction } from "@/app/admin/actions"

type NavLink = { href: string; label: string; icon: string; exact?: boolean }
type NavGroup = { section: string; links: NavLink[] }

const navItems: NavGroup[] = [
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
  {
    section: "Sistema",
    links: [
      { href: "/admin/configuracoes", label: "Configurações", icon: "◉" },
    ],
  },
]

type Props = { open?: boolean; onClose?: () => void }

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname()

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className={`adminSidebar${open ? " adminSidebar--open" : ""}`}>
      <div className="adminSidebarHeader">
        <Link href="/admin" className="adminSidebarLogoLink">
          <Image
            src="/logo.png"
            alt="1M2F Gallery"
            width={72}
            height={28}
            priority
            style={{ objectFit: "contain", objectPosition: "left center" }}
          />
        </Link>
        <span className="adminSidebarTag">Admin</span>
        {onClose && (
          <button
            type="button"
            className="adminSidebarClose"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            ✕
          </button>
        )}
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