"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useFavorites } from "@/context/FavoritesContext"
import GlobalSearch from "@/components/GlobalSearch"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { count } = useFavorites()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const links = [
    { href: "/",           label: "Home"        },
    { href: "/artworks",   label: "Galeria"     },
    { href: "/exposicoes", label: "Exposições"  },
    { href: "/about",      label: "Sobre"       },
    { href: "/faq",        label: "FAQ"         },
    { href: "/contact",    label: "Contato"     },
  ]

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <Link href="/" className="logo">
        <Image
          src="/logo.png"
          alt="1M2F Gallery"
          width={72}
          height={28}
          priority
          style={{ objectFit: "contain", objectPosition: "left center" }}
        />
      </Link>

      <nav className="navDesktop">
        {links.map(({ href, label }) => (
          <Link key={href} href={href} className={pathname === href ? "active" : ""}>
            {label}
          </Link>
        ))}

        <GlobalSearch />

        <Link
          href="/favoritos"
          className={`favNavBtn${pathname === "/favoritos" ? " active" : ""}`}
          aria-label="Favoritos"
          title="Favoritos"
        >
          <svg viewBox="0 0 24 24" fill={count > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {count > 0 && <span className="favNavCount">{count}</span>}
        </Link>
      </nav>

      <button
        type="button"
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
      >
        <span />
        <span />
        <span />
      </button>

      {menuOpen && (
        <nav className="navMobile">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className={pathname === href ? "active" : ""}>
              {label}
            </Link>
          ))}
          <Link href="/favoritos" className={`navMobileFav${pathname === "/favoritos" ? " active" : ""}`}>
            Favoritos {count > 0 && `(${count})`}
          </Link>
        </nav>
      )}
    </header>
  )
}
