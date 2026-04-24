"use client"

import { useCallback, useEffect, useState } from "react"
import AdminBreadcrumb from "@/app/admin/_components/AdminBreadcrumb"

type LogEntry = {
  id: number
  entity_type: string
  entity_id: number | null
  entity_title: string | null
  action: string
  created_at: string
}

type PageData = {
  items: LogEntry[]
  total: number
  page: number
  pages: number
}

const ENTITY_TYPES = ["Todos", "obra", "exposição", "depoimento", "configurações"]

const ACTION_LABELS: Record<string, string> = {
  criou:     "criou",
  atualizou: "atualizou",
  deletou:   "deletou",
}

const ACTION_CLASS: Record<string, string> = {
  criou:     "histBadge--green",
  atualizou: "histBadge--gold",
  deletou:   "histBadge--red",
}

const ENTITY_ICON: Record<string, string> = {
  "obra":          "◻",
  "exposição":     "◇",
  "depoimento":    "◎",
  "configurações": "◉",
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

export default function AdminHistorico() {
  const [data, setData]           = useState<PageData>({ items: [], total: 0, page: 1, pages: 1 })
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(false)
  const [page, setPage]           = useState(1)
  const [filterType, setFilterType] = useState("Todos")

  const load = useCallback(() => {
    setLoading(true)
    setError(false)
    const params = new URLSearchParams({ page: String(page) })
    if (filterType !== "Todos") params.set("entity_type", filterType)
    fetch(`/api/admin/audit-logs?${params}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [page, filterType])

  useEffect(() => { load() }, [load])

  function handleFilter(type: string) {
    setFilterType(type)
    setPage(1)
  }

  return (
    <div className="adminPage">
      <div className="adminPageHeader">
        <div>
          <AdminBreadcrumb crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Histórico" }]} />
          <h1>Histórico de alterações <span className="adminPageCount">{loading ? "" : `(${data.total})`}</span></h1>
        </div>
      </div>

      <div className="adminFilters">
        {ENTITY_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            className={`adminFilterChip${filterType === t ? " adminFilterChip--active" : ""}`}
            onClick={() => handleFilter(t)}
          >
            {t !== "Todos" && <span>{ENTITY_ICON[t] ?? "○"} </span>}
            {t === "Todos" ? "Todos" : t.charAt(0).toUpperCase() + t.slice(1) + "s"}
          </button>
        ))}
      </div>

      {error && <p className="adminError">Não foi possível carregar o histórico.</p>}
      {loading && <p className="adminEmpty">Carregando…</p>}

      {!loading && !error && (
        <>
          {data.items.length === 0 && (
            <p className="adminEmpty">Nenhuma alteração registrada ainda.</p>
          )}

          {data.items.length > 0 && (
            <div className="histTimeline">
              {data.items.map((log) => (
                <div key={log.id} className="histEntry">
                  <div className="histEntryIcon">
                    {ENTITY_ICON[log.entity_type] ?? "○"}
                  </div>
                  <div className="histEntryBody">
                    <div className="histEntryMain">
                      <span className={`histBadge ${ACTION_CLASS[log.action] ?? "histBadge--gold"}`}>
                        {ACTION_LABELS[log.action] ?? log.action}
                      </span>
                      <span className="histEntryType">{log.entity_type}</span>
                      {log.entity_title && (
                        <span className="histEntryTitle">"{log.entity_title}"</span>
                      )}
                    </div>
                    <time className="histEntryTime">{formatDate(log.created_at)}</time>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.pages > 1 && (
            <div className="adminPagination">
              <button
                type="button"
                className="adminPaginationBtn"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Anterior
              </button>
              <span className="adminPaginationInfo">
                Página {data.page} de {data.pages}
              </span>
              <button
                type="button"
                className="adminPaginationBtn"
                disabled={page >= data.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
