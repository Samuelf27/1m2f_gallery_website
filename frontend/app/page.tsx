"use client"

import { useEffect, useRef, useState } from "react"
import { getArtworks, getTestimonials } from "../services/api"
import type { Artwork } from "@/types/artwork.types"
import type { Testimonial } from "@/types/testimonial.types"
import Link from "next/link"
import Image from "next/image"
import FavoriteButton from "@/components/FavoriteButton"
import Newsletter from "@/components/Newsletter"

/* ── Counter hook ─────────────────────────────────────── */
function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          function tick(now: number) {
            const progress = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - progress, 3) // ease-out-cubic
            setCount(Math.round(ease * target))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

/* ── Stat item ─────────────────────────────────────────── */
function StatItem({ num, suffix, label }: { num: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(num)
  return (
    <div ref={ref} className="heroStripItem">
      <span className="heroStripValue">
        {num > 999 ? count.toLocaleString("pt-BR") : count}{suffix}
      </span>
      <span className="heroStripLabel">{label}</span>
    </div>
  )
}

const heroStats = [
  { num: 6000, suffix: "+", label: "Obras criadas" },
  { num: 30,   suffix: "+", label: "Anos de arte"  },
  { num: 4,    suffix: "",  label: "Continentes"   },
]

export default function Home() {
  const [artworks, setArtworks]           = useState<Artwork[]>([])
  const [testimonials, setTestimonials]   = useState<Testimonial[]>([])
  const [carouselError, setCarouselError] = useState(false)
  const [videoPlaying, setVideoPlaying]   = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const heroRef     = useRef<HTMLElement>(null)
  const bgRef       = useRef<HTMLDivElement>(null)
  const textRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getArtworks().then(setArtworks).catch(() => setCarouselError(true))
    getTestimonials().then((data) => setTestimonials(data.filter((t) => t.visible))).catch(() => {})
  }, [])

  // Scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible") }),
      { threshold: 0.08 }
    )
    document.querySelectorAll(".anim").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [artworks])

  // Parallax
  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
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
      left: dir === "right" ? carouselRef.current.clientWidth * 0.8 : -(carouselRef.current.clientWidth * 0.8),
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
        <div ref={bgRef} className="heroBg">
          <Image
            src="/hero.png"
            alt="1M2F Gallery — Ateliê de Maria França"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="heroBgImg"
            style={{ objectFit: "cover", objectPosition: "center center" }}
          />
        </div>
        <div className="heroBgOverlay" />

        <div ref={textRef} className="heroText heroAnimated">
          <div className="heroTag">Arte contemporânea · São Paulo</div>
          <h1 className="heroTitle">
            <Image
              src="/logo.png"
              alt="1M2F Gallery"
              width={340}
              height={132}
              priority
              className="heroLogo"
              style={{ objectFit: "contain", objectPosition: "left center" }}
            />
          </h1>
          <p className="heroSubtitle">
            A galeria de Maria França — mais de 6.000 obras em acrílico, tela, porcelana e aço.
          </p>
          <a href="#colecao" className="heroButton heroButtonPulse">
            Explorar coleção →
          </a>
        </div>

        <div className="heroScroll"><span /></div>
      </section>

      {/* ─── STATS STRIP ───────────────────────────────────── */}
      <div className="heroStrip">
        {heroStats.map((s) => (
          <StatItem key={s.label} num={s.num} suffix={s.suffix} label={s.label} />
        ))}
        <div className="heroStripItem">
          <span className="heroStripValue">SP</span>
          <span className="heroStripLabel">São Paulo, Brasil</span>
        </div>
      </div>

      {/* ─── CARROSSEL ─────────────────────────────────────── */}
      <section id="colecao" className="carouselSection">
        <div className="carouselSectionHeader">
          <div className="sectionHeader anim">
            <h2>Coleção em destaque</h2>
            <p>Obras selecionadas</p>
          </div>
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
                  <FavoriteButton id={art.id} />
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

      {/* ─── MANIFESTO ─────────────────────────────────────── */}
      <section className="manifestoSection">
        <blockquote className="manifestoText anim">
          Arte é perder-se ou encontrar-se em seus próprios pensamentos.<br />
          É criar, compartilhar a existência e respeitar o Outro.<br />
          <em>A arte é uma companheira da vida.</em>
        </blockquote>
        <p className="manifestoAuthor anim" style={{ "--delay": "150ms" } as React.CSSProperties}>
          — Maria França
        </p>
      </section>

      {/* ─── VÍDEO ─────────────────────────────────────────── */}
      <section className="videoSection">
        <div className="sectionHeader videoSectionHeader anim">
          <h2>Arte em movimento</h2>
          <p>Conheça o processo criativo</p>
        </div>

        <div className="videoWrapper anim" style={{ "--delay": "100ms" } as React.CSSProperties}>
          {videoPlaying ? (
            <iframe
              src="https://www.youtube.com/embed/TB5uBxVcP78?autoplay=1&rel=0&modestbranding=1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="1M2F Art Gallery — Maria França"
            />
          ) : (
            <button type="button" className="videoThumb" onClick={() => setVideoPlaying(true)} aria-label="Reproduzir vídeo">
              <Image
                src="/images/video-thumbnail.jpg"
                alt="Reproduzir vídeo de Maria França"
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
            alt="Maria França — artista"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            style={{ objectFit: "cover", filter: "grayscale(8%)" }}
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

      {/* ─── DEPOIMENTOS ───────────────────────────────────── */}
      <section className="testimonialsSection">
        <div className="sectionHeader testimonialsSectionHeader anim">
          <h2>O que dizem nossos clientes</h2>
          <p>Depoimentos</p>
        </div>

        <div className="testimonialsGrid">
          {testimonials.map((t, i) => (
            <article
              key={t.id}
              className="testimonialCard anim"
              style={{ "--delay": `${i * 120}ms` } as React.CSSProperties}
            >
              <div className="testimonialQuoteMark">&ldquo;</div>
              <blockquote className="testimonialQuote">{t.text}</blockquote>
              <div className="testimonialDivider" />
              <footer className="testimonialFooter">
                <span className="testimonialAuthor">{t.name}</span>
                {(t.role || t.city) && (
                  <span className="testimonialMeta">
                    {[t.role, t.city].filter(Boolean).join(" · ")}
                  </span>
                )}
              </footer>
            </article>
          ))}
        </div>
      </section>

      {/* ─── NEWSLETTER ────────────────────────────────────── */}
      <Newsletter />

      {/* ─── CTA ───────────────────────────────────────────── */}
      <section className="ctaSection anim">
        <div className="ctaContent">
          <h2>Arte que <em>transforma</em><br />ambientes</h2>
          <p>Cada obra é única. Adquira uma peça de Maria França e leve a arte para o seu espaço.</p>
        </div>
        <Link href="/artworks" className="ctaLink">Ver todas as obras →</Link>
      </section>

    </main>
  )
}
