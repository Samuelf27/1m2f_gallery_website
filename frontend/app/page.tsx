"use client"

import { useEffect, useRef, useState } from "react"
import { getArtworks } from "../services/api"
import type { Artwork } from "@/types/artwork.types"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [carouselError, setCarouselError] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getArtworks().then(setArtworks).catch(() => setCarouselError(true))
  }, [])

  // Scroll animations via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible") }),
      { threshold: 0.1 }
    )
    document.querySelectorAll(".anim").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [artworks])

  // Parallax de alta precisão: relativo ao centro do hero
  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5   // -0.5 a 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5

    // DOM direto: sem re-render, melhor performance para animações
    bgRef.current?.style.setProperty("--parallax-x", `${x * 36}px`)
    bgRef.current?.style.setProperty("--parallax-y", `${y * 36}px`)
    textRef.current?.style.setProperty("--text-x", `${x * -10}px`)
    textRef.current?.style.setProperty("--text-y", `${y * -10}px`)
  }

  function handleMouseLeave() {
    bgRef.current?.style.setProperty("--parallax-x", "0px")
    bgRef.current?.style.setProperty("--parallax-y", "0px")
    textRef.current?.style.setProperty("--text-x", "0px")
    textRef.current?.style.setProperty("--text-y", "0px")
  }

  function scrollCarousel(dir: "left" | "right") {
    if (!carouselRef.current) return
    carouselRef.current.scrollBy({
      left: dir === "right" ? carouselRef.current.clientWidth * 0.75 : -(carouselRef.current.clientWidth * 0.75),
      behavior: "smooth",
    })
  }

  return (
    <main>

      {/* ─── HERO ──────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="hero"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Imagem com parallax de fundo */}
        <div ref={bgRef} className="heroBg">
          <Image
            src="/hero.png"
            alt="1M2F Gallery — Ateliê"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center center" }}
          />
        </div>

        {/* Overlay gradiente: forte à esquerda para legibilidade */}
        <div className="heroBgOverlay" />

        {/* Texto à esquerda com counter-parallax */}
        <div ref={textRef} className="heroText heroAnimated">
          <div className="heroTag">Arte contemporânea · São Paulo</div>
          <h1 className="heroTitle">
            1M2F<br /><span>Gallery</span>
          </h1>
          <p className="heroSubtitle">
            A galeria de Maria França — mais de 6.000 obras em acrílico, tela, porcelana e aço.
          </p>
          <a href="#colecao" className="heroButton heroButtonPulse">
            Explorar coleção →
          </a>
        </div>

        {/* Indicador de scroll */}
        <div className="heroScroll"><span /></div>
      </section>

      {/* ─── CARROSSEL ─────────────────────────────────────── */}
      <section id="colecao" className="carouselSection">
        <div className="sectionHeader carouselSectionHeader anim">
          <h2>Coleção em destaque</h2>
          <p>Obras selecionadas</p>
        </div>

        <div className="carouselWrapper">
          <button type="button" className="carouselBtn carouselBtnLeft" onClick={() => scrollCarousel("left")} aria-label="Anterior">←</button>

          <div className="carouselTrack" ref={carouselRef}>
            {carouselError ? (
              <p className="carouselEmpty">Não foi possível carregar as obras. Tente novamente mais tarde.</p>
            ) : artworks.length === 0 ? (
              <p className="carouselEmpty">Carregando obras…</p>
            ) : (
              artworks.map((art) => (
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
              ))
            )}
          </div>

          <button type="button" className="carouselBtn carouselBtnRight" onClick={() => scrollCarousel("right")} aria-label="Próximo">→</button>
        </div>

        {artworks.length > 0 && (
          <div className="carouselFooter anim">
            <Link href="/artworks" className="heroButton">Ver todas as {artworks.length} obras →</Link>
          </div>
        )}
      </section>

      {/* ─── VÍDEO ─────────────────────────────────────────── */}
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
            <button type="button" className="videoThumb" onClick={() => setVideoPlaying(true)} aria-label="Reproduzir vídeo">
              <Image
                src="/images/video-thumbnail.jpg"
                alt="Reproduzir vídeo"
                fill
                sizes="(max-width: 768px) 100vw, 960px"
                style={{ objectFit: "cover" }}
              />
              <div className="videoThumbOverlay" />
              <div className="playButton">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </button>
          )}
        </div>
      </section>

      {/* ─── SOBRE ─────────────────────────────────────────── */}
      <section className="homeAbout">
        <div className="homeAboutImage anim anim--left">
          <Image
            src="/images/maria-franca.jpeg"
            alt="Maria França"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            style={{ objectFit: "cover", filter: "grayscale(10%)" }}
          />
        </div>
        <div className="homeAboutText anim anim--right">
          <div className="aboutTag">A artista</div>
          <h2>Maria<br /><em>França</em></h2>
          <p>
            Brasileira, nascida em 1969, São Paulo. Com vivências em quatro continentes e mais de 6.000 obras criadas, une técnica e sentimento para transformar espaços em experiências únicas.
          </p>
          <Link href="/about" className="heroButton">Conhecer a artista →</Link>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────── */}
      <section className="ctaSection anim">
        <div className="ctaContent">
          <h2>Arte que <em>transforma</em><br />ambientes</h2>
          <p>Descubra a coleção completa de Maria França</p>
        </div>
        <Link href="/artworks" className="ctaLink">Ver todas as obras →</Link>
      </section>


    </main>
  )
}