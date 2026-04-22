"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { getAllArtworks } from "@/services/api"
import { deleteArtworkAction, updateArtworkAction } from "@/app/admin/actions"
import type { Artwork } from "@/types/artwork.types"
import Link from "next/link"
import Image from "next/image"
import AdminBreadcrumb from "@/app/admin/_components/AdminBreadcrumb"

/* ── Bulk action helper ───────────────────────────────────── */
async function bulkUpdateAvailable(ids: number[], artworks: Artwork[], value: string) {
  await Promise.all(
    ids.map((id) => {
      const art = artworks.find((a) => a.id === id)
      if (!art) return Promise.resolve()
      return updateArtworkAction(id, {
        title: art.title, artist: art.artist ?? "", year: art.year,
        description: art.description, image_url: art.image_url,
        category: art.category, dimensions: art.dimensions ?? "",
        available: value, featured: art.featured,
      })
    })
  )
}

export default function AdminArtworks() {
  const [artworks, setArtworks]     = useState<Artwork[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(false)
  const [search, setSearch]         = useState("")
  const [filterCat, setFilterCat]   = useState("Todas")
  const [filterAvail, setFilterAvail] = useState("Todas")
  const [selected, setSelected]     = useState<Set<number>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    getAllArtworks()
      .then((data) => { setArtworks(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  useEffect(() => { load() }, [load])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(artworks.map((a) => a.category).filter(Boolean)))
    return ["Todas", ...cats.sort()]
  }, [artworks])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return artworks.filter((a) => {
      const matchQ    = !q || a.title.toLowerCase().includes(q) || (a.artist ?? "").toLowerCase().includes(q)
      const matchCat  = filterCat === "Todas" || a.category === filterCat
      const matchAvail = filterAvail === "Todas" || a.available === filterAvail
      return matchQ && matchCat && matchAvail
    })
  }, [artworks, search, filterCat, filterAvail])

  const allSelected = filtered.length > 0 && filtered.every((a) => selected.has(a.id))

  function toggleAll() {
    if (allSelected) {
      setSelected((prev) => { const s = new Set(prev); filtered.forEach((a) => s.delete(a.id)); return s })
    } else {
      setSelected((prev) => { const s = new Set(prev); filtered.forEach((a) => s.add(a.id)); return s })
    }
  }

  function toggleOne(id: number) {
    setSelected((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  async function handleBulkAvailable(value: string) {
    if (selected.size === 0) return
    setBulkLoading(true)
    await bulkUpdateAvailable(Array.from(selected), artworks, value)
    setSelected(new Set())
    load()
    setBulkLoading(false)
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return
    if (!confirm(`Apagar ${selected.size} obra(s)?`)) return
    setBulkLoading(true)
    await Promise.all(Array.from(selected).map((id) => deleteArtworkAction(id)))
    setSelected(new Set())
    load()
    setBulkLoading(false)
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Apagar "${title}"?`)) return
    await deleteArtworkAction(id)
    load()
  }

  return (
    <div className="adminPage">
      <div className="adminPageHeader">
        <div>
          <AdminBreadcrumb crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Obras" }]} />
          <h1>Obras <span className="adminPageCount">{loading ? "" : `(${filtered.length})`}</span></h1>
        </div>
        <Link href="/admin/artworks/new" className="adminButton">+ Nova Obra</Link>
      </div>

      {/* ── Filtros ──────────────────────────────────────────── */}
      <div className="adminFilters">
        <div className="adminSearchWrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" />
          </svg>
          <input
            type="search"
            placeholder="Buscar por título ou artista…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="adminSearchInput"
          />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="adminFilterSelect">
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterAvail} onChange={(e) => setFilterAvail(e.target.value)} className="adminFilterSelect">
          <option value="Todas">Disponibilidade</option>
          <option value="disponível">Disponível</option>
          <option value="vendido">Vendido</option>
        </select>
        {(search || filterCat !== "Todas" || filterAvail !== "Todas") && (
          <button type="button" className="adminClearBtn" onClick={() => { setSearch(""); setFilterCat("Todas"); setFilterAvail("Todas") }}>
            Limpar ×
          </button>
        )}
      </div>

      {/* ── Bulk actions ─────────────────────────────────────── */}
      {selected.size > 0 && (
        <div className="adminBulkBar">
          <span className="adminBulkCount">{selected.size} selecionada(s)</span>
          <button type="button" className="adminBulkBtn adminBulkBtn--green" onClick={() => handleBulkAvailable("disponível")} disabled={bulkLoading}>
            Marcar disponível
          </button>
          <button type="button" className="adminBulkBtn adminBulkBtn--gold" onClick={() => handleBulkAvailable("vendido")} disabled={bulkLoading}>
            Marcar vendido
          </button>
          <button type="button" className="adminBulkBtn adminBulkBtn--red" onClick={handleBulkDelete} disabled={bulkLoading}>
            Apagar
          </button>
          <button type="button" className="adminClearBtn" onClick={() => setSelected(new Set())}>
            Cancelar
          </button>
        </div>
      )}

      {/* ── Error / Loading ───────────────────────────────────── */}
      {error && <p className="adminError">Não foi possível carregar as obras.</p>}
      {loading && <p className="adminEmpty">Carregando…</p>}

      {/* ── Lista ─────────────────────────────────────────────── */}
      {!loading && !error && (
        <div className="adminList">
          {filtered.length === 0 && <p className="adminEmpty">Nenhuma obra encontrada.</p>}

          {filtered.length > 0 && (
            <div className="adminListHeader">
              <label className="adminCheckbox">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                <span />
              </label>
              <span className="adminListHeaderLabel">Selecionar todas</span>
            </div>
          )}

          {filtered.map((art) => (
            <div key={art.id} className={`adminCard${selected.has(art.id) ? " adminCard--selected" : ""}`}>
              <label className="adminCheckbox">
                <input type="checkbox" checked={selected.has(art.id)} onChange={() => toggleOne(art.id)} />
                <span />
              </label>

              <div className="adminCardImage">
                <Image src={art.image_url} alt={art.title} fill style={{ objectFit: "cover" }} sizes="80px" />
              </div>

              <div className="adminCardInfo">
                <h3>{art.title}</h3>
                <p>{art.artist}</p>
                <span>{art.category}{art.year ? ` · ${art.year}` : ""}</span>
              </div>

              <div className="adminCardBadges">
                {art.featured && <span className="adminBadge adminBadge--gold">Destaque</span>}
                <span className={`adminBadge ${art.available === "vendido" ? "adminBadge--red" : "adminBadge--green"}`}>
                  {art.available || "disponível"}
                </span>
              </div>

              <div className="adminCardActions">
                <Link href={`/artwork/${art.id}`} target="_blank" className="adminViewBtn" title="Ver no site">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </Link>
                <Link href={`/admin/artworks/${art.id}`} className="editButton">Editar</Link>
                <button type="button" className="deleteButton" onClick={() => handleDelete(art.id, art.title)}>
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
