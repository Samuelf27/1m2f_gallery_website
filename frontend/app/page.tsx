"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { getArtworks } from "../services/api"
import type { Artwork } from "@/types/artwork.types"
import Link from "next/link"

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getArtworks()
      .then(setArtworks)
      .catch(() => setError("Não foi possível carregar as obras. Tente novamente mais tarde."))

    const handleScroll = () => {
      if (window.scrollY > 120) setVisible(true)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="main">

      {/* HERO */}
      <section className="hero">
        <div className="heroOverlay" />

        <div className="heroContent">
          <h1 className="heroTitle">
            1M2F <span>Gallery</span>
          </h1>

          <p className="heroSubtitle">
            Experiência minimalista em arte contemporânea
          </p>

          <a href="#gallery" className="heroButton">
            Explorar coleção
          </a>
        </div>
      </section>

      {/* GALERIA */}
      <section
        id="gallery"
        className={`gallery ${visible ? "show" : ""}`}
      >
        <div className="container">

          <div className="sectionHeader">
            <h2>Coleção</h2>
            <p>Curadoria exclusiva de obras digitais</p>
          </div>

          {/* ERRO */}
          {error && (
            <p className="errorMessage">{error}</p>
          )}

          <div className="grid">
            {artworks.map((art, index) => (
              <Link
                key={art.id}
                href={`/artwork/${art.id}`}
                className="card"
              >
                <div
                  className={`imageWrapper ${visible ? "fadeUp" : ""}`}
                  style={{ animationDelay: `${index * 0.07}s` }}
                >
                  <img
                    src={art.image_url}
                    alt={art.title}
                  />

                  <div className="cardOverlay">
                    <div className="cardContent">
                      <h3>{art.title}</h3>
                      <span>{art.artist}</span>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* CTA FINAL */}
      <section className="ctaSection">
        <div className="ctaContent">
          <h2>Explore arte como nunca antes</h2>
          <p>Descubra artistas e coleções únicas</p>
        </div>
      </section>

    </main>
  )
}
