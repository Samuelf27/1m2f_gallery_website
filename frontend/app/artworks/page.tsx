"use client"

import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { getAllArtworks } from "@/services/api"
import type { Artwork } from "@/types/artwork.types"
import Link from "next/link"
import Image from "next/image"
import FavoriteButton from "@/components/FavoriteButton"
import ArtworkModal from "@/components/ArtworkModal"

const PAGE_SIZE = 24

type SortKey = "newest" | "oldest" | "az" | "za"

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Mais recente" },
  { value: "oldest", label: "Mais antigo"  },
  { value: "az",     label: "A → Z"        },
  { value: "za",     label: "Z → A"        },
]

/* ─── Componente interno que usa useSearchParams ──────────── */
function GalleryContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const obraId       = searchParams.get("obra")

  const [artworks, setArtworks]       = useState<Artwork[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(false)
  const [search, setSearch]           = useState("")
  const [category, setCategory]       = useState("Todas")
  const [year, setYear]               = useState("Todos")
  const [sort, setSort]               = useState<SortKey>("newest")
  const [gridCols, setGridCols]       = useState<2 | 3>(2)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getAllArtworks()
      .then((data) => { setArtworks(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(artworks.map((a) => a.category).filter(Boolean)))
    return ["Todas", ...cats.sort()]
  }, [artworks])

  const years = useMemo(() => {
    const ys = Array.from(new Set(artworks.map((a) => a.year).filter(Boolean)))
    return ["Todos", ...ys.sort((a, b) => parseInt(b) - parseInt(a))]
  }, [artworks])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return artworks.filter((a) => {
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.category?.toLowerCase().includes(q)
      const matchCat    = category === "Todas" || a.category === category
      const matchYear   = year === "Todos" || a.year === year
      return matchSearch && matchCat && matchYear
    })
  }, [artworks, search, category, year])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "newest": return (parseInt(b.year) || 0) - (parseInt(a.year) || 0)
        case "oldest": return (parseInt(a.year) || 0) - (parseInt(b.year) || 0)
        case "az":     return a.title.localeCompare(b.title, "pt-BR")
        case "za":     return b.title.localeCompare(a.title, "pt-BR")
        default:       return 0
      }
    })
  }, [filtered, sort])

  const paginated  = sorted.slice(0, visibleCount)
  const hasMore    = visibleCount < sorted.length
  const activeFilters = (search ? 1 : 0) + (category !== "Todas" ? 1 : 0) + (year !== "Todos" ? 1 : 0)

  // Reset visible count when filters/sort change
  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [search, category, sort])

  // IntersectionObserver for infinite scroll
  const loadMore = useCallback(() => {
    setVisibleCount((n) => Math.min(n + PAGE_SIZE, sorted.length))
  }, [sorted.length])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasMore) loadMore() },
      { rootMargin: "300px" }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  function handleSearch(value: string)   { setSearch(value);   }
  function handleCategory(value: string) { setCategory(value); }
  function handleSort(value: SortKey)    { setSort(value);     }

  function clearFilters() {
    setSearch(""); setCategory("Todas"); setYear("Todos"); setSort("newest")
  }

  function openModal(id: number) {
    router.push(`/artworks?obra=${id}`, { scroll: false })
  }

  return (
    <>
      {/* ─── HEADER ─────────────────────────────────────────── */}
      <div className="pageHeader">
        <div>
          <h1 className="title">Coleção</h1>
          <p className="pageSubtitle">
            {loading
              ? "Carregando…"
              : `${sorted.length} obra${sorted.length !== 1 ? "s" : ""} encontrada${sorted.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="pageHeaderActions">
          <div className="gridToggle" role="group" aria-label="Colunas do grid">
            <button
              type="button"
              className={`gridToggleBtn${gridCols === 2 ? " active" : ""}`}
              onClick={() => setGridCols(2)}
              aria-label="2 colunas" title="2 colunas"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <rect x="0" y="0" width="7" height="7" rx="0.5" />
                <rect x="9" y="0" width="7" height="7" rx="0.5" />
                <rect x="0" y="9" width="7" height="7" rx="0.5" />
                <rect x="9" y="9" width="7" height="7" rx="0.5" />
              </svg>
            </button>
            <button
              type="button"
              className={`gridToggleBtn${gridCols === 3 ? " active" : ""}`}
              onClick={() => setGridCols(3)}
              aria-label="3 colunas" title="3 colunas"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <rect x="0"  y="0" width="4" height="7" rx="0.5" />
                <rect x="6"  y="0" width="4" height="7" rx="0.5" />
                <rect x="12" y="0" width="4" height="7" rx="0.5" />
                <rect x="0"  y="9" width="4" height="7" rx="0.5" />
                <rect x="6"  y="9" width="4" height="7" rx="0.5" />
                <rect x="12" y="9" width="4" height="7" rx="0.5" />
              </svg>
            </button>
          </div>
          <Link href="/contact" className="heroButton">Adquirir uma obra →</Link>
        </div>
      </div>

      {/* ─── FILTROS ────────────────────────────────────────── */}
      <div className="galleryFilters">
        <div className="galleryFilterRow">
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

          <div className="gallerySortWrapper">
            <label className="gallerySortLabel" htmlFor="gallery-year">Ano</label>
            <select
              id="gallery-year"
              className="gallerySort"
              value={year}
              onChange={(e) => { setYear(e.target.value); setVisibleCount(PAGE_SIZE) }}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="gallerySortWrapper">
            <label className="gallerySortLabel" htmlFor="gallery-sort">Ordenar</label>
            <select
              id="gallery-sort"
              className="gallerySort"
              value={sort}
              onChange={(e) => handleSort(e.target.value as SortKey)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="galleryFilterBottom">
          <div className="galleryCats">
            {categories.map((cat) => (
              <button key={cat} type="button"
                className={`galleryCatBtn${category === cat ? " active" : ""}`}
                onClick={() => handleCategory(cat)}
              >{cat}</button>
            ))}
          </div>
          {activeFilters > 0 && (
            <button type="button" className="galleryClearBtn" onClick={clearFilters}>
              Limpar filtros ×
            </button>
          )}
        </div>
      </div>

      {/* ─── SKELETON LOADING ───────────────────────────────── */}
      {loading && (
        <div className={`grid grid--${gridCols}`}>
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="skeletonCard" style={{ "--delay": `${(i % 6) * 60}ms` } as React.CSSProperties}>
              <div className="skeletonImage" />
              <div className="skeletonMeta">
                <div className="skeletonLine skeletonLine--title" />
                <div className="skeletonLine skeletonLine--sub" />
              </div>
            </div>
          ))}
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

      {/* ─── GRID ───────────────────────────────────────────── */}
      {!loading && !error && (
        <>
          {paginated.length === 0 ? (
            <div className="galleryState">
              <p>Nenhuma obra encontrada{search ? ` para "${search}"` : ""}.</p>
              <button type="button" className="heroButton" onClick={clearFilters}>
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className={`grid grid--${gridCols}`}>
              {paginated.map((art, index) => (
                <button
                  key={art.id}
                  type="button"
                  className="card cardBtn"
                  onClick={() => openModal(art.id)}
                  aria-label={`Ver obra: ${art.title}`}
                >
                  <div className="imageWrapper fadeUp">
                    <Image
                      src={art.image_url}
                      alt={art.title}
                      fill
                      sizes={gridCols === 3 ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, 50vw"}
                      style={{ objectFit: "cover" }}
                      loading={index < 6 ? "eager" : "lazy"}
                    />
                    <div className="cardOverlay">
                      <div className="cardContent">
                        <h3>{art.title}</h3>
                        <span>{art.category}</span>
                      </div>
                    </div>
                  </div>
                  <FavoriteButton id={art.id} />
                </button>
              ))}
            </div>
          )}

          {/* ─── INFINITE SCROLL SENTINEL ───────────────────── */}
          <div ref={sentinelRef} className="infiniteScrollSentinel">
            {hasMore && <div className="infiniteScrollSpinner" />}
          </div>
        </>
      )}

      {/* ─── MODAL ──────────────────────────────────────────── */}
      {obraId && <ArtworkModal id={obraId} />}
    </>
  )
}

/* ─── Página principal ────────────────────────────────────── */
export default function ArtworksPage() {
  return (
    <main className="page">
      <Suspense fallback={
        <div className="grid grid--2" style={{ padding: "120px 24px 40px" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeletonCard">
              <div className="skeletonImage" />
              <div className="skeletonMeta">
                <div className="skeletonLine skeletonLine--title" />
                <div className="skeletonLine skeletonLine--sub" />
              </div>
            </div>
          ))}
        </div>
      }>
        <GalleryContent />
      </Suspense>
    </main>
  )
}
