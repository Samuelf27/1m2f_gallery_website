"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { getArtworks } from "@/services/api"
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

  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)
  const [search, setSearch]     = useState("")
  const [category, setCategory] = useState("Todas")
  const [sort, setSort]         = useState<SortKey>("newest")
  const [gridCols, setGridCols] = useState<2 | 3>(2)
  const [page, setPage]         = useState(1)

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
      const matchCat    = category === "Todas" || a.category === category
      return matchSearch && matchCat
    })
  }, [artworks, search, category])

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

  const activeFilters = (search ? 1 : 0) + (category !== "Todas" ? 1 : 0)
  const totalPages    = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage   = Math.min(page, totalPages)
  const paginated     = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleSearch(value: string)  { setSearch(value);   setPage(1) }
  function handleCategory(value: string){ setCategory(value); setPage(1) }
  function handleSort(value: SortKey)   { setSort(value);     setPage(1) }

  function clearFilters() {
    setSearch(""); setCategory("Todas"); setSort("newest"); setPage(1)
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

      {/* ─── ESTADOS ────────────────────────────────────────── */}
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

          {/* ─── PAGINAÇÃO ──────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="pagination">
              <button type="button" className="paginationBtn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1} aria-label="Página anterior"
              >←</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…")
                  acc.push(p)
                  return acc
                }, [])
                .map((item, i) =>
                  item === "…" ? (
                    <span key={`ell-${i}`} className="paginationEllipsis">…</span>
                  ) : (
                    <button key={item} type="button"
                      className={`paginationBtn${currentPage === item ? " active" : ""}`}
                      onClick={() => setPage(item as number)}
                    >{item}</button>
                  )
                )}

              <button type="button" className="paginationBtn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages} aria-label="Próxima página"
              >→</button>
            </div>
          )}
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
        <div className="galleryState" style={{ paddingTop: "160px" }}>
          <div className="gallerySpinner" />
        </div>
      }>
        <GalleryContent />
      </Suspense>
    </main>
  )
}
