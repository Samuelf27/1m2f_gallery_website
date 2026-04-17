"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getExhibitions } from "@/services/api"
import type { Exhibition, ExhibitionStatus } from "@/types/exhibition.types"

/* ── Helpers de calendário ────────────────────────────────── */
function toCalDate(dateStr: string) {
  return dateStr.replace(/-/g, "")
}

function buildGoogleCalUrl(exh: Exhibition) {
  const p = new URLSearchParams({
    action:   "TEMPLATE",
    text:     exh.title,
    dates:    `${toCalDate(exh.start_date!)}/${toCalDate(exh.end_date!)}`,
    details:  exh.description ?? "",
    location: exh.location ?? "",
  })
  return `https://calendar.google.com/calendar/render?${p.toString()}`
}

function downloadIcs(exh: Exhibition) {
  const uid = `exhibition-${exh.id}@1m2f-gallery`
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//1M2F Gallery//PT",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART;VALUE=DATE:${toCalDate(exh.start_date!)}`,
    `DTEND;VALUE=DATE:${toCalDate(exh.end_date!)}`,
    `SUMMARY:${exh.title}`,
    `DESCRIPTION:${(exh.description ?? "").replace(/\n/g, "\\n")}`,
    `LOCATION:${exh.location ?? ""}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement("a"), { href: url, download: `${exh.title}.ics` })
  a.click()
  URL.revokeObjectURL(url)
}

/* ── Utilitários ──────────────────────────────────────────── */
const MONTHS_PT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
]

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  const [year, month] = dateStr.split("-").map(Number)
  return `${MONTHS_PT[month - 1]} ${year}`
}

const STATUS_CONFIG: Record<ExhibitionStatus, { label: string; className: string }> = {
  proxima:    { label: "Próxima",    className: "exhBadge exhBadge--upcoming" },
  em_cartaz:  { label: "Em cartaz",  className: "exhBadge exhBadge--ongoing"  },
  encerrada:  { label: "Encerrada",  className: "exhBadge exhBadge--past"     },
  indefinida: { label: "Sem data",   className: "exhBadge exhBadge--past"     },
}

type FilterKey = "all" | ExhibitionStatus

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all",       label: "Todas"     },
  { key: "proxima",   label: "Próximas"  },
  { key: "em_cartaz", label: "Em cartaz" },
  { key: "encerrada", label: "Encerradas"},
]

/* ── Componente ───────────────────────────────────────────── */
export default function ExposicoesPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [loading, setLoading]         = useState(true)
  const [filter, setFilter]           = useState<FilterKey>("all")

  useEffect(() => {
    getExhibitions()
      .then((data) => { setExhibitions(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const visible = filter === "all"
    ? exhibitions
    : exhibitions.filter((e) => e.status === filter)

  const activeCount = exhibitions.filter(
    (e) => e.status === "proxima" || e.status === "em_cartaz"
  ).length

  return (
    <main className="page exhPage">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="pageHeader exhHeader">
        <div>
          <div className="aboutTag" style={{ marginBottom: "16px" }}>Agenda cultural</div>
          <h1 className="title" style={{ marginBottom: "8px" }}>Exposições</h1>
          <p className="pageSubtitle">
            {loading
              ? "Carregando…"
              : activeCount > 0
                ? `${activeCount} exposição${activeCount !== 1 ? "ões" : ""} em breve ou em cartaz`
                : `${exhibitions.length} exposição${exhibitions.length !== 1 ? "ões" : ""} no histórico`}
          </p>
        </div>
        <Link href="/contact" className="heroButton">Propor parceria →</Link>
      </div>

      {/* ── Loading ─────────────────────────────────────────── */}
      {loading && (
        <div className="galleryState">
          <div className="gallerySpinner" />
          <p>Carregando exposições…</p>
        </div>
      )}

      {/* ── Filtros ─────────────────────────────────────────── */}
      {!loading && (
        <div className="exhFilters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`galleryCatBtn${filter === f.key ? " active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Lista ───────────────────────────────────────────── */}
      {!loading && visible.length === 0 && (
        <div className="galleryState">
          <p>Nenhuma exposição nesta categoria.</p>
          <button type="button" className="heroButton" onClick={() => setFilter("all")}>
            Ver todas →
          </button>
        </div>
      )}

      {!loading && visible.length > 0 && (
        <div className="exhList">
          {visible.map((exh, i) => {
            const badge   = STATUS_CONFIG[exh.status]
            const isPast  = exh.status === "encerrada" || exh.status === "indefinida"
            const hasDates = exh.start_date && exh.end_date
            return (
              <article
                key={exh.id}
                className={`exhCard${isPast ? " exhCard--past" : ""}`}
                style={{ "--delay": `${i * 80}ms` } as React.CSSProperties}
              >
                {/* Coluna de datas */}
                <div className="exhDates">
                  <span className={badge.className}>{badge.label}</span>
                  <time className="exhDateRange">
                    {formatDate(exh.start_date)}
                    <span className="exhDateSep">—</span>
                    {formatDate(exh.end_date)}
                  </time>
                </div>

                {/* Divisor vertical */}
                <div className="exhDivider" />

                {/* Conteúdo */}
                <div className="exhContent">
                  {exh.subtitle && <p className="exhSubtitle">{exh.subtitle}</p>}
                  <h2 className="exhTitle">{exh.title}</h2>
                  {exh.location && (
                    <p className="exhLocation">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M12 21c-4-4-7-7.5-7-10.5a7 7 0 1 1 14 0C19 13.5 16 17 12 21z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                      {exh.location}
                    </p>
                  )}
                  {exh.description && (
                    <p className="exhDescription">{exh.description}</p>
                  )}

                  {!isPast && hasDates && (
                    <div className="exhActions">
                      <a
                        href={buildGoogleCalUrl(exh)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="exhCalBtn"
                        title="Adicionar ao Google Calendar"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        Google Calendar
                      </a>
                      <button
                        type="button"
                        className="exhCalBtn"
                        onClick={() => downloadIcs(exh)}
                        title="Baixar arquivo .ics"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        .ics
                      </button>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* ── CTA ─────────────────────────────────────────────── */}
      {!loading && (
        <section className="exhCta">
          <div>
            <h2>Quer receber a agenda <em>completa</em>?</h2>
            <p>Entre em contato para saber sobre próximas exposições, vernissages e eventos exclusivos.</p>
          </div>
          <Link href="/contact" className="heroButton">Entrar em contato →</Link>
        </section>
      )}

    </main>
  )
}
