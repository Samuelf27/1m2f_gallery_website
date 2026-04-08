"use client"

export const dynamic = "force-dynamic"

import { useEffect, useRef, useState } from "react"
import { getArtworks } from "../services/api"
import type { Artwork } from "@/types/artwork.types"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [videoPlaying, setVideoPlaying] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Busca obras
  useEffect(() => {
    getArtworks().then(setArtworks).catch(() => {})
  }, [])

  // Scroll animations via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.12 }
    )
    document.querySelectorAll(".anim").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [artworks])

  // Parallax do mouse no hero
  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const x = (e.clientX / window.innerWidth - 0.5) * 28
    const y = (e.clientY / window.innerHeight - 0.5) * 28
    setMousePos({ x, y })
  }

  // Navegação do carrossel
  function scrollCarousel(dir: "left" | "right") {
    if (!carouselRef.current) return
    const amount = carouselRef.current.clientWidth * 0.75
    carouselRef.current.scrollBy({
      left: dir === "right" ? amount : -amount,
      behavior: "smooth",
    })
  }

  return (
    <main>

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="hero heroCentered" onMouseMove={handleMouseMove}>
        <div
          className="heroBg"
          style={{
            "--parallax-x": `${mousePos.x * 0.35}px`,
            "--parallax-y": `${mousePos.y * 0.35}px`,
          } as React.CSSProperties}
        >
          <Image
            src="https://1m2f.b-cdn.net/wp-content/uploads/2025/08/23-scaled.jpg"
            alt="1M2F Gallery"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="heroBgOverlay heroCenteredOverlay" />

        <div className="heroCenter">
          <div className="heroLogo">
            <Image
              src="/logo.png"
              alt="1M2F Gallery"
              width={320}
              height={120}
              priority
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="heroTag">Arte contemporânea · São Paulo</div>
          <p className="heroSubtitle">
            A galeria de Maria França — mais de 6.000 obras em acrílico, tela, porcelana e aço.
          </p>
          <a href="#colecao" className="heroButton heroButtonLarge">
            Explorar coleção →
          </a>
        </div>

        <div className="heroScroll">
          <span />
        </div>
      </section>

      {/* ─── CARROSSEL ────────────────────────────────────────── */}
      <section id="colecao" className="carouselSection">
        <div className="sectionHeader carouselSectionHeader anim">
          <h2>Coleção em destaque</h2>
          <p>Obras selecionadas</p>
        </div>

        <div className="carouselWrapper">
          <button
            type="button"
            className="carouselBtn carouselBtnLeft"
            onClick={() => scrollCarousel("left")}
            aria-label="Anterior"
          >
            ←
          </button>

          <div className="carouselTrack" ref={carouselRef}>
            {artworks.map((art) => (
              <Link key={art.id} href={`/artwork/${art.id}`} className="carouselCard">
                <div className="carouselCardInner">
                  <Image
                    src={art.image_url}
                    alt={art.title}
                    fill
                    sizes="340px"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="carouselCardOverlay">
                    <h3>{art.title}</h3>
                    <span>{art.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="carouselBtn carouselBtnRight"
            onClick={() => scrollCarousel("right")}
            aria-label="Próximo"
          >
            →
          </button>
        </div>

        {artworks.length > 0 && (
          <div className="carouselFooter anim">
            <Link href="/artworks" className="heroButton">
              Ver todas as {artworks.length} obras →
            </Link>
          </div>
        )}
      </section>

      {/* ─── VÍDEO ────────────────────────────────────────────── */}
      <section className="videoSection">
        <div className="sectionHeader videoSectionHeader anim">
          <h2>Arte em movimento</h2>
          <p>Conheça o processo criativo</p>
        </div>

        <div className="videoWrapper anim">
          {videoPlaying ? (
            <iframe
              src="https://www.youtube.com/embed/TB5uBxVcP78?autoplay=1&rel=0&modestbranding=1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="1M2F Art Gallery"
            />
          ) : (
            <button
              type="button"
              className="videoThumb"
              onClick={() => setVideoPlaying(true)}
              aria-label="Reproduzir vídeo"
            >
              <Image
                src="https://1m2f.b-cdn.net/wp-content/uploads/2025/08/23-scaled.jpg"
                alt="Reproduzir vídeo"
                fill
                sizes="(max-width: 768px) 100vw, 960px"
                style={{ objectFit: "cover" }}
              />
              <div className="videoThumbOverlay" />
              <div className="playButton">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}
        </div>
      </section>

      {/* ─── SOBRE ────────────────────────────────────────────── */}
      <section className="homeAbout">
        <div className="homeAboutImage anim">
          <Image
            src="https://1m2f.b-cdn.net/wp-content/uploads/2024/03/maria-1512x1512-1.jpeg"
            alt="Maria França"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            style={{ objectFit: "cover", filter: "grayscale(10%)" }}
          />
        </div>

        <div className="homeAboutText anim">
          <div className="aboutTag">A artista</div>
          <h2>Maria<br /><em>França</em></h2>
          <p>
            Brasileira, nascida em 1969, São Paulo. Com vivências em quatro continentes e mais de 6.000 obras criadas, Maria François une técnica e sentimento para transformar espaços em experiências únicas.
          </p>
          <Link href="/about" className="heroButton">
            Conhecer a artista →
          </Link>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="ctaSection anim">
        <div className="ctaContent">
          <h2>Arte que <em>transforma</em><br />ambientes</h2>
          <p>Descubra a coleção completa de Maria França</p>
        </div>
        <Link href="/artworks" className="ctaLink">
          Ver todas as obras →
        </Link>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footerLogo">1M2F</div>
        <p>© 2026 Maria França. Todos os direitos reservados.</p>
        <div className="footerLinks">
          <a href="https://www.instagram.com/1m2f_art_gallery/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.youtube.com/@1M2FArtGallery-MariaFran%C3%A7a" target="_blank" rel="noopener noreferrer">YouTube</a>
          <Link href="/about">Sobre</Link>
          <Link href="/contact">Contato</Link>
        </div>
      </footer>

    </main>
  )
}