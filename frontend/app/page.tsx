"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { getArtworks } from "../services/api"
import type { Artwork } from "@/types/artwork.types"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getArtworks()
      .then(setArtworks)
      .catch(() => setError("Não foi possível carregar as obras."))

    const handleScroll = () => {
      if (window.scrollY > 120) setVisible(true)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main>

      {/* HERO */}
      <section className="hero">
        <div className="heroText">
          <div className="heroTag">Arte contemporânea · São Paulo</div>
          <h1 className="heroTitle">
            1M2F<br /><span>Gallery</span>
          </h1>
          <p className="heroSubtitle">
            A galeria de Maria França — mais de 6.000 obras em acrílico sobre tela, papel, porcelana e aço. Arte que cria atmosferas únicas e transforma ambientes.
          </p>
          <a href="#gallery" className="heroButton">
            Explorar coleção →
          </a>
        </div>

        <div className="heroImage">
          <Image
            src="https://1m2f.b-cdn.net/wp-content/uploads/2025/08/23-scaled.jpg"
            alt="The Secret of the Seas — Maria França"
            fill
            priority
            sizes="50vw"
            style={{ objectFit: "cover" }}
          />
          <div className="heroImageOverlay" />
        </div>
      </section>

      {/* GALERIA */}
      <section id="gallery" className={`gallery ${visible ? "show" : ""}`}>
        <div className="sectionHeader">
          <h2>Coleção</h2>
          <p>Obras selecionadas</p>
        </div>

        {error && <p className="errorMessage">{error}</p>}

        <div className="grid">
          {artworks.slice(0, 12).map((art, index) => (
            <Link key={art.id} href={`/artwork/${art.id}`} className="card">
              <div
                className={`imageWrapper ${visible ? "fadeUp" : ""}`}
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                <Image
                  src={art.image_url}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  loading={index < 4 ? "eager" : "lazy"}
                />
                <div className="cardOverlay">
                  <div className="cardContent">
                    <h3>{art.title}</h3>
                    <span>{art.category}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {artworks.length > 12 && (
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <Link href="/artworks" className="heroButton">
              Ver todas as {artworks.length} obras →
            </Link>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="ctaSection">
        <div className="ctaContent">
          <h2>Arte que <em>transforma</em><br />ambientes</h2>
          <p>Descubra a coleção completa de Maria França</p>
        </div>
        <Link href="/artworks" className="ctaLink">
          Ver todas as obras →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footerLogo">1M2F</div>
        <p>© 2026 Maria França. Todos os direitos reservados.</p>
        <div className="footerLinks">
          <a href="https://www.instagram.com/1m2f_art_gallery/" target="_blank">Instagram</a>
          <Link href="/about">Sobre</Link>
          <Link href="/contact">Contato</Link>
        </div>
      </footer>

    </main>
  )
}
