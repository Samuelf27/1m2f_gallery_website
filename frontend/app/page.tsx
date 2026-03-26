"use client"

import { useEffect, useState } from "react"
import { getArtworks } from "../services/api"
import Link from "next/link"

export default function Home() {
  const [artworks, setArtworks] = useState([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    getArtworks().then(setArtworks)

    const handleScroll = () => {
      if (window.scrollY > 100) setVisible(true)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="page">

      {/* HERO */}
      <section className="hero">
        <div className="overlay" />
        <div className="heroContent">
          <h1>1M2F Gallery</h1>
          <p>Explore o melhor da arte contemporânea</p>
          <a href="#gallery" className="cta">Explorar</a>
        </div>
      </section>

      {/* GALERIA */}
      <section id="gallery" className={`gallery ${visible ? "show" : ""}`}>
        <h2>Galeria</h2>

        <div className="grid">
          {artworks.map((art: any, index) => (
            <Link key={art.id} href={`/artwork/${art.id}`} className="card">

              <div
                className="imageWrapper fadeUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img src={art.image_url} alt={art.title} />

                <div className="overlayCard">
                  <h3>{art.title}</h3>
                  <p>{art.artist}</p>
                </div>
              </div>

            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        © 2026 1M2F Gallery — All rights reserved
      </footer>

    </main>
  )
}