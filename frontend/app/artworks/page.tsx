"use client"

import { useEffect, useMemo, useState } from "react"
import { getArtworks } from "@/services/api"
import type { Artwork } from "@/types/artwork.types"
import Link from "next/link"
import Image from "next/image"
import FavoriteButton from "@/components/FavoriteButton"

const PAGE_SIZE = 24

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("Todas")
  const [page, setPage] = useState(1)

  useEffect(() => {
    getArtworks()
      .then((data) => { setArtworks(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(artworks.map((a) => a.category).filter(Boolean)))
    return ["Todas", ...cats.sort()]
  }, [artworks])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return artworks.filter((a) => {
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.category?.toLowerCase().includes(q)
      const matchCat = category === "Todas" || a.category === category
      return matchSearch && matchCat
    })
  }, [artworks, search, category])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleCategory(value: string) {
    setCategory(value)
    setPage(1)
  }

  return (
    <main className="page">

      <div className="pageHeader">
        <div>
          <h1 className="title">Coleção</h1>
          <p className="pageSubtitle">
            {loading ? "Carregando…" : `${filtered.length} obra${filtered.length !== 1 ? "s" : ""} encontrada${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link href="/contact" className="heroButton">Adquirir uma obra →</Link>
      </div>

      {/* ─── FILTROS ──────────────────────────────────────────── */}
      <div className="galleryFilters">
        <div className="gallerySearchWrapper">
          <svg className="gallerySearchIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" />
          </svg>
          <input
            type="search"
            className="gallerySearch"
            placeholder="Buscar por título ou categoria…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="galleryCats">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`galleryCatBtn${category === cat ? " active" : ""}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── ESTADO DE CARREGAMENTO / ERRO ────────────────────── */}
      {loading && (
        <div className="galleryState">
          <div className="gallerySpinner" />
          <p>Carregando obras…</p>
        </div>
      )}

      {error && (
        <div className="galleryState galleryError">
          <p>Não foi possível carregar as obras.</p>
          <button type="button" className="heroButton" onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        </div>
      )}

      {/* ─── GRID ─────────────────────────────────────────────── */}
      {!loading && !error && (
        <>
          {paginated.length === 0 ? (
            <div className="galleryState">
              <p>Nenhuma obra encontrada para &ldquo;{search}&rdquo;.</p>
              <button type="button" className="heroButton" onClick={() => { setSearch(""); setCategory("Todas") }}>
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid">
              {paginated.map((art, index) => (
                <Link key={art.id} href={`/artwork/${art.id}`} className="card">
                  <div className="imageWrapper fadeUp">
                    <Image
                      src={art.image_url}
                      alt={art.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
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
                  <FavoriteButton id={art.id} />
                </Link>
              ))}
            </div>
          )}

          {/* ─── PAGINAÇÃO ──────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="paginationBtn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Página anterior"
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…")
                  acc.push(p)
                  return acc
                }, [])
                .map((item, i) =>
                  item === "…" ? (
                    <span key={`ellipsis-${i}`} className="paginationEllipsis">…</span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      className={`paginationBtn${currentPage === item ? " active" : ""}`}
                      onClick={() => setPage(item as number)}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                type="button"
                className="paginationBtn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Próxima página"
              >
                →
              </button>
            </div>
          )}
        </>
      )}

    </main>
  )
}
