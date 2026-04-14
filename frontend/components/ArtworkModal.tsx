"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getArtwork } from "@/services/api"
import type { Artwork } from "@/types/artwork.types"
import { WHATSAPP_NUMBER } from "@/lib/config"
import FavoriteButton from "@/components/FavoriteButton"

export default function ArtworkModal({ id }: { id: string }) {
  const router  = useRouter()
  const infoRef = useRef<HTMLDivElement>(null)
  const [art, setArt]       = useState<Artwork | null>(null)
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)

  /* Busca a obra */
  useEffect(() => {
    setLoading(true)
    setArt(null)
    getArtwork(id)
      .then((data) => {
        setArt(data)
        setLoading(false)
        // Salva no histórico
        try {
          const key = "1m2f_history"
          const prev: number[] = JSON.parse(localStorage.getItem(key) ?? "[]")
          const next = [data.id, ...prev.filter((x) => x !== data.id)].slice(0, 20)
          localStorage.setItem(key, JSON.stringify(next))
        } catch { /* ignore */ }
      })
      .catch(() => setLoading(false))
  }, [id])

  /* Animação de entrada */
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  /* Bloqueia scroll do body */
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [])

  /* ESC fecha */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  function close() {
    setVisible(false)
    setTimeout(() => router.push("/artworks", { scroll: false }), 260)
  }

  async function shareArtwork() {
    if (!art) return
    const url = `${window.location.origin}/artwork/${art.id}`
    if (navigator.share) {
      try {
        await navigator.share({ title: art.title, text: `Confira esta obra de Maria França: ${art.title}`, url })
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const [copied, setCopied] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  const whatsappMsg = art
    ? encodeURIComponent(`Olá! Tenho interesse em adquirir a obra "${art.title}". Poderia me dar mais informações?`)
    : ""
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`

  return (
    <div
      className={`artModal${visible ? " artModal--visible" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={art?.title ?? "Obra"}
    >
      {/* Backdrop clicável */}
      <div className="artModalBackdrop" onClick={close} />

      {/* Painel */}
      <div className={`artModalPanel${visible ? " artModalPanel--visible" : ""}`}>

        {/* Botão fechar */}
        <button
          type="button"
          className="artModalClose"
          onClick={close}
          aria-label="Fechar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Loading */}
        {loading && (
          <div className="artModalLoading">
            <div className="gallerySpinner" />
          </div>
        )}

        {/* Conteúdo */}
        {art && (
          <div className="artModalInner">

            {/* Imagem */}
            <div
              className="artModalImage artModalImage--zoomable"
              onClick={() => setZoomed(true)}
              title="Clique para ampliar"
            >
              <Image
                src={art.image_url}
                alt={art.title}
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                style={{ objectFit: "cover" }}
                priority
              />
              <div className="artZoomHint">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4M11 8v6M8 11h6" />
                </svg>
              </div>
              <FavoriteButton id={art.id} />
            </div>

            {/* Lightbox */}
            {zoomed && (
              <div className="artLightbox" onClick={() => setZoomed(false)} role="dialog" aria-label="Imagem ampliada">
                <button type="button" className="artLightboxClose" onClick={() => setZoomed(false)} aria-label="Fechar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
                <div className="artLightboxImg" onClick={(e) => e.stopPropagation()}>
                  <Image
                    src={art.image_url}
                    alt={art.title}
                    fill
                    sizes="100vw"
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </div>
              </div>
            )}

            {/* Info */}
            <div className="artModalInfo" ref={infoRef}>

              {art.category && (
                <div className="artCategory">{art.category}</div>
              )}

              <h2 className="artTitle">{art.title}</h2>

              {art.artist && (
                <p className="artArtist">{art.artist}</p>
              )}

              {art.year && (
                <div className="artMetaRow">
                  <div className="artMetaItem">
                    <span className="artMetaLabel">Ano</span>
                    <span className="artMetaValue">{art.year}</span>
                  </div>
                  <div className="artMetaItem">
                    <span className="artMetaLabel">Origem</span>
                    <span className="artMetaValue">São Paulo, Brasil</span>
                  </div>
                  <div className="artMetaItem">
                    <span className="artMetaLabel">Disponibilidade</span>
                    <span className="artMetaValue artMetaAvailable">Disponível</span>
                  </div>
                </div>
              )}

              {art.description && (
                <p className="artDescription">{art.description}</p>
              )}

              <div className="artDivider" />

              {/* Trust strip compacto */}
              <div className="artTrustStrip">
                <div className="artTrustItem">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Obra original certificada
                </div>
                <div className="artTrustItem">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Resposta em até 24h
                </div>
              </div>

              {/* CTA WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="acquireBtn"
                aria-label={`Adquirir "${art.title}" via WhatsApp`}
              >
                <span className="acquireBtnBg" />
                <span className="acquireBtnText">Adquirir esta Obra</span>
                <span className="acquireBtnIcon">→</span>
              </a>

              {/* Ações secundárias */}
              <div className="artModalActions">
                <Link href={`/artwork/${art.id}`} className="artModalFullLink">
                  Ver página completa →
                </Link>
                <button
                  type="button"
                  className="artShareBtn"
                  onClick={shareArtwork}
                  aria-label="Compartilhar obra"
                  title={copied ? "Link copiado!" : "Compartilhar"}
                >
                  {copied ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
                    </svg>
                  )}
                  <span>{copied ? "Copiado!" : "Compartilhar"}</span>
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}
