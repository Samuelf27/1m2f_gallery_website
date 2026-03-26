"use client"

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
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      
      <div className="logo">1M2F</div>

      <nav>
        <a href="#gallery">Galeria</a>
        <a href="#about">Sobre</a>
        <a href="#contact">Contato</a>
      </nav>

    </header>
  )
}