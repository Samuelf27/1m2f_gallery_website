"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <Link href="/" className="logo">
        1M2F
      </Link>

      <nav>
        <Link 
          href="/" 
          className={pathname === "/" ? "active" : ""}
        >
          Home
        </Link>
        
        <Link 
          href="/artworks" 
          className={pathname === "/artworks" ? "active" : ""}
        >
          Galeria
        </Link>
        
        <Link 
          href="/about" 
          className={pathname === "/about" ? "active" : ""}
        >
          Sobre
        </Link>
        
        <Link 
          href="/contact" 
          className={pathname === "/contact" ? "active" : ""}
        >
          Contato
        </Link>
      </nav>
    </header>
  )
}
