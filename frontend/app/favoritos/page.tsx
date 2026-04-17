"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { getAllArtworks } from "@/services/api"
import type { Artwork } from "@/types/artwork.types"
import Link from "next/link"
import Image from "next/image"
import { useFavorites } from "@/context/FavoritesContext"
import FavoriteButton from "@/components/FavoriteButton"
import { useArtworkHistory } from "@/hooks/useArtworkHistory"

function ShareFavoritesButton({ count }: { count: number }) {
  const [copied, setCopied] = useState(false)

  const share = useCallback(async () => {
    const url  = window.location.href
    const text = `Veja as ${count} obras que salvei na Galeria 1M2F`

    if (navigator.share) {
      try { await navigator.share({ title: "Meus favoritos — 1M2F Gallery", text, url }) } catch { /* cancelado */ }
      return
    }

    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [count])

  return (
    <button type="button" onClick={share} className="exhCalBtn">
      {copied ? (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Link copiado
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
          </svg>
          Partilhar
        </>
      )}
    </button>
  )
}

export default function FavoritosPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading]   = useState(true)
  const { ids }                 = useFavorites()
  const { historyIds }          = useArtworkHistory()

  useEffect(() => {
    getAllArtworks()
      .then((data) => { setArtworks(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const favorites = useMemo(
    () => artworks.filter((a) => ids.includes(a.id)),
    [artworks, ids]
  )

  const recentlyViewed = useMemo(
    () => historyIds
      .map((id) => artworks.find((a) => a.id === id))
      .filter((a): a is Artwork => !!a && !ids.includes(a.id))
      .slice(0, 6),
    [artworks, historyIds, ids]
  )

  return (
    <main className="page">

      <div className="pageHeader">
        <div>
          <h1 className="title">Favoritos</h1>
          <p className="pageSubtitle">
            {loading
              ? "Carregando…"
              : `${favorites.length} obra${favorites.length !== 1 ? "s" : ""} salva${favorites.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          {!loading && favorites.length > 0 && (
            <ShareFavoritesButton count={favorites.length} />
          )}
          <Link href="/artworks" className="heroButton">Ver toda a coleção →</Link>
        </div>
      </div>

      {loading && (
        <div className="galleryState">
          <div className="gallerySpinner" />
          <p>Carregando obras…</p>
        </div>
      )}

      {!loading && favorites.length === 0 && (
        <div className="favEmpty">
          <div className="favEmptyIcon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <p>Nenhuma obra salva ainda.</p>
          <p className="favEmptyHint">Clique no coração nas obras da galeria para salvá-las aqui.</p>
          <Link href="/artworks" className="heroButton" style={{ marginTop: "8px" }}>
            Explorar a coleção →
          </Link>
        </div>
      )}

      {!loading && favorites.length > 0 && (
        <div className="grid">
          {favorites.map((art) => (
            <Link key={art.id} href={`/artwork/${art.id}`} className="card">
              <div className="imageWrapper fadeUp">
                <Image
                  src={art.image_url}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
                <div className="cardOverlay">
                  <div className="cardContent">
                    <h3>{art.title}</h3>
                    <span>{art.category}</span>
                  </div>
                </div>
              </div>
              <FavoriteButton id={art.id} />
            </Link>
          ))}
        </div>
      )}

      {/* ─── HISTÓRICO ──────────────────────────────────────── */}
      {!loading && recentlyViewed.length > 0 && (
        <section className="recentSection">
          <h2 className="recentTitle">Vistas recentemente</h2>
          <div className="recentGrid">
            {recentlyViewed.map((art) => (
              <Link key={art.id} href={`/artwork/${art.id}`} className="recentCard">
                <div className="recentCardImage">
                  <Image
                    src={art.image_url}
                    alt={art.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 200px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <p className="recentCardTitle">{art.title}</p>
                <p className="recentCardCat">{art.category}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  )
}
