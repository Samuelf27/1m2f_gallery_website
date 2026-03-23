"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { getArtworks } from "../services/api"
import Link from "next/link"

export default function Home() {
  const [artworks, setArtworks] = useState([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    getArtworks().then(setArtworks)

    const handleScroll = () => {
      if (window.scrollY > 150) setVisible(true)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="page">

      <section className="hero">
        <div className="heroContent">
          <h2>Contemporary Art Experience</h2>
          <p>Descubra obras únicas e artistas contemporâneos</p>
        </div>
      </section>

      <section className={`gallery ${visible ? "show" : ""}`}>
        <h2>Galeria</h2>

        <div className="grid">
          {artworks.map((art: any, index) => (
            <Link key={art.id} href={`/artwork/${art.id}`} className="card">
              <div
                className={`imageWrapper ${visible ? "fadeUp" : ""}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <img src={art.image_url} alt={art.title} />

                <div className="overlay">
                  <h3>{art.title}</h3>
                  <p>{art.artist}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="footer">
        © 2026 1M2F Gallery — All rights reserved
      </footer>

    </main>
  )
}