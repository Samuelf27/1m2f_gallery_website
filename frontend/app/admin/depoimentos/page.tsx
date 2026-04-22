"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { getTestimonials } from "@/services/api"
import {
  deleteTestimonialAction,
  toggleTestimonialVisibleAction,
} from "@/app/admin/actions"
import type { Testimonial } from "@/types/testimonial.types"
import Link from "next/link"
import AdminBreadcrumb from "@/app/admin/_components/AdminBreadcrumb"

export default function AdminDepoimentos() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(false)
  const [search, setSearch]             = useState("")
  const [filterVisible, setFilterVisible] = useState("Todos")

  const load = useCallback(() => {
    setLoading(true)
    getTestimonials()
      .then((data) => { setTestimonials(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return testimonials.filter((t) => {
      const matchQ = !q || t.name.toLowerCase().includes(q) || t.text.toLowerCase().includes(q)
      const matchV = filterVisible === "Todos"
        || (filterVisible === "Visível" && t.visible)
        || (filterVisible === "Oculto" && !t.visible)
      return matchQ && matchV
    })
  }, [testimonials, search, filterVisible])

  async function handleToggleVisible(t: Testimonial) {
    await toggleTestimonialVisibleAction(t.id, t.visible, {
      name: t.name, text: t.text,
      city: t.city ?? "", role: t.role ?? "",
      visible: t.visible,
    })
    load()
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Apagar depoimento de "${name}"?`)) return
    await deleteTestimonialAction(id)
    load()
  }

  return (
    <div className="adminPage">
      <div className="adminPageHeader">
        <div>
          <AdminBreadcrumb crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Depoimentos" }]} />
          <h1>Depoimentos <span className="adminPageCount">{loading ? "" : `(${filtered.length})`}</span></h1>
        </div>
        <Link href="/admin/depoimentos/new" className="adminButton">+ Novo Depoimento</Link>
      </div>

      {/* ── Filtros ──────────────────────────────────────────── */}
      <div className="adminFilters">
        <div className="adminSearchWrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" />
          </svg>
          <input
            type="search"
            placeholder="Buscar por nome ou texto…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="adminSearchInput"
          />
        </div>
        <select value={filterVisible} onChange={(e) => setFilterVisible(e.target.value)} className="adminFilterSelect">
          <option value="Todos">Visibilidade</option>
          <option value="Visível">Visível</option>
          <option value="Oculto">Oculto</option>
        </select>
        {(search || filterVisible !== "Todos") && (
          <button type="button" className="adminClearBtn" onClick={() => { setSearch(""); setFilterVisible("Todos") }}>
            Limpar ×
          </button>
        )}
      </div>

      {error && <p className="adminError">Não foi possível carregar os depoimentos.</p>}
      {loading && <p className="adminEmpty">Carregando…</p>}

      {!loading && !error && (
        <div className="adminList">
          {filtered.length === 0 && <p className="adminEmpty">Nenhum depoimento encontrado.</p>}

          {filtered.map((t) => (
            <div key={t.id} className="adminCard">
              <div className="adminCardInfo">
                <h3>{t.name}</h3>
                {t.role && <p>{t.role}{t.city ? ` · ${t.city}` : ""}</p>}
                <span className="adminCardExcerpt">
                  &ldquo;{t.text.length > 120 ? t.text.slice(0, 120) + "…" : t.text}&rdquo;
                </span>
              </div>

              <div className="adminCardBadges">
                <span className={`adminBadge ${t.visible ? "adminBadge--green" : "adminBadge--dim"}`}>
                  {t.visible ? "Visível" : "Oculto"}
                </span>
              </div>

              <div className="adminCardActions">
                <button
                  type="button"
                  className={`adminToggleBtn ${t.visible ? "adminToggleBtn--avail" : ""}`}
                  title={t.visible ? "Ocultar" : "Exibir no site"}
                  onClick={() => handleToggleVisible(t)}
                >
                  {t.visible ? "◉" : "○"}
                </button>
                <Link href={`/admin/depoimentos/${t.id}`} className="editButton">Editar</Link>
                <button type="button" className="deleteButton" onClick={() => handleDelete(t.id, t.name)}>
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
