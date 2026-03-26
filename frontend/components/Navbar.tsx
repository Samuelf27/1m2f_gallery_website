"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="logo">1M2F</div>

      <nav>
        <Link href="/">Home</Link>
        <Link href="/artworks">Galeria</Link>
        <Link href="/about">Sobre</Link>
        <Link href="/contact">Contato</Link>
      </nav>
    </header>
  )
}