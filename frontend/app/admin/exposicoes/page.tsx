"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { getExhibitions } from "@/services/api"
import { deleteExhibitionAction } from "@/app/admin/actions"
import type { Exhibition } from "@/types/exhibition.types"
import Link from "next/link"
import AdminBreadcrumb from "@/app/admin/_components/AdminBreadcrumb"

const STATUS_LABELS: Record<string, string> = {
  proxima:    "Próxima",
  em_cartaz:  "Em cartaz",
  encerrada:  "Encerrada",
  indefinida: "Sem data",
}

const STATUS_CLASS: Record<string, string> = {
  proxima:    "adminBadge--gold",
  em_cartaz:  "adminBadge--green",
  encerrada:  "adminBadge--dim",
  indefinida: "adminBadge--dim",
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—"
  const [y, m, d] = dateStr.split("-")
  return `${d}/${m}/${y}`
}

export default function AdminExposicoes() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(false)
  const [search, setSearch]           = useState("")
  const [filterStatus, setFilterStatus] = useState("Todos")

  const load = useCallback(() => {
    setLoading(true)
    getExhibitions()
      .then((data) => { setExhibitions(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return exhibitions.filter((ex) => {
      const matchQ = !q || ex.title.toLowerCase().includes(q) || (ex.location ?? "").toLowerCase().includes(q)
      const matchS = filterStatus === "Todos" || ex.status === filterStatus
      return matchQ && matchS
    })
  }, [exhibitions, search, filterStatus])

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Apagar "${title}"?`)) return
    await deleteExhibitionAction(id)
    load()
  }

  return (
    <div className="adminPage">
      <div className="adminPageHeader">
        <div>
          <AdminBreadcrumb crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Exposições" }]} />
          <h1>Exposições <span className="adminPageCount">{loading ? "" : `(${filtered.length})`}</span></h1>
        </div>
        <Link href="/admin/exposicoes/new" className="adminButton">+ Nova Exposição</Link>
      </div>

      {/* ── Filtros ──────────────────────────────────────────── */}
      <div className="adminFilters">
        <div className="adminSearchWrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" />
          </svg>
          <input
            type="search"
            placeholder="Buscar por título ou local…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="adminSearchInput"
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="adminFilterSelect">
          <option value="Todos">Status</option>
          <option value="em_cartaz">Em cartaz</option>
          <option value="proxima">Próxima</option>
          <option value="encerrada">Encerrada</option>
        </select>
        {(search || filterStatus !== "Todos") && (
          <button type="button" className="adminClearBtn" onClick={() => { setSearch(""); setFilterStatus("Todos") }}>
            Limpar ×
          </button>
        )}
      </div>

      {error && <p className="adminError">Não foi possível carregar as exposições.</p>}
      {loading && <p className="adminEmpty">Carregando…</p>}

      {!loading && !error && (
        <div className="adminList">
          {filtered.length === 0 && <p className="adminEmpty">Nenhuma exposição encontrada.</p>}

          {filtered.map((ex) => (
            <div key={ex.id} className="adminCard">
              <div className="adminCardInfo">
                <h3>{ex.title}</h3>
                {ex.subtitle && <p>{ex.subtitle}</p>}
                <span>
                  {ex.location ? `${ex.location} · ` : ""}
                  {formatDate(ex.start_date)} — {formatDate(ex.end_date)}
                </span>
              </div>

              <div className="adminCardBadges">
                <span className={`adminBadge ${STATUS_CLASS[ex.status]}`}>
                  {STATUS_LABELS[ex.status]}
                </span>
              </div>

              <div className="adminCardActions">
                <Link href={`/admin/exposicoes/${ex.id}`} className="editButton">Editar</Link>
                <button type="button" className="deleteButton" onClick={() => handleDelete(ex.id, ex.title)}>
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
