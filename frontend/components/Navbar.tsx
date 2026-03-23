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

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 60px;
          transition: all 0.4s ease;
          z-index: 1000;
        }

        .scrolled {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(12px);
          padding: 15px 60px;
        }

        .logo {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          letter-spacing: 2px;
        }

        .nav {
          display: flex;
          gap: 30px;
        }

        .nav a {
          text-decoration: none;
          color: #ccc;
          font-size: 14px;
          position: relative;
          transition: 0.3s;
        }

        .nav a::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -5px;
          width: 0%;
          height: 1px;
          background: #fff;
          transition: 0.3s;
        }

        .nav a:hover {
          color: #fff;
        }

        .nav a:hover::after {
          width: 100%;
        }
      `}</style>

    </header>
  )
}