"use client"

import { useEffect, useState } from "react"
import { getArtworks } from "../services/api"
import Link from "next/link"

export default function Home() {
  const [artworks, setArtworks] = useState<any[]>([])
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    getArtworks().then(setArtworks)

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main>

      {/* NAVBAR */}
      <header className={`navbar ${scrolled ? "active" : ""}`}>
        <h1>1M2F</h1>
        <nav>
          <a href="#gallery">Galeria</a>
          <a href="#">Sobre</a>
          <a href="#">Contato</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="overlay" />

        <div className="heroContent">
          <h1>1M2F Gallery</h1>
          <p>Arte contemporânea com identidade</p>
          <a href="#gallery">Explorar</a>
        </div>
      </section>

      {/* GALERIA */}
      <section id="gallery" className="gallery">
        <h2>Galeria</h2>

        <div className="grid">
          {artworks.map((art, i) => (
            <Link
              key={art.id}
              href={`/artwork/${art.id}`}
              className="card"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <img src={art.image_url} alt={art.title} />

              <div className="cardOverlay">
                <h3>{art.title}</h3>
                <p>{art.artist}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="footer">
        © 2026 1M2F — Samuel Ferreira
      </footer>

    </main>
  )
}