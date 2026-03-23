"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

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
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      
      <div className="logo">1M2F</div>

      <nav className="nav">
        <Link href="/">Home</Link>
        <Link href="/artworks">Artworks</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>

    </header>
  )
}