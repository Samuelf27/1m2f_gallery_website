"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

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
    { href: "/", label: "Home" },
    { href: "/artworks", label: "Galeria" },
    { href: "/about", label: "Sobre" },
    { href: "/contact", label: "Contato" },
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
        </nav>
      )}
    </header>
  )
}