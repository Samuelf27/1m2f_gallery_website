"use client"

import { useState } from "react"
import Link from "next/link"

/* ── Helpers de calendário ────────────────────────────────── */
function toCalDate(dateStr: string) {
  return dateStr.replace(/-/g, "")
}

function buildGoogleCalUrl(exh: Exhibition) {
  const p = new URLSearchParams({
    action:   "TEMPLATE",
    text:     exh.title,
    dates:    `${toCalDate(exh.startDate)}/${toCalDate(exh.endDate)}`,
    details:  exh.description,
    location: `${exh.location}, ${exh.city}`,
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
    `DTSTART;VALUE=DATE:${toCalDate(exh.startDate)}`,
    `DTEND;VALUE=DATE:${toCalDate(exh.endDate)}`,
    `SUMMARY:${exh.title}`,
    `DESCRIPTION:${exh.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${exh.location}\\, ${exh.city}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement("a"), { href: url, download: `${exh.title}.ics` })
  a.click()
  URL.revokeObjectURL(url)
}

/* ── Tipos ────────────────────────────────────────────────── */
type ExhibitionStatus = "upcoming" | "ongoing" | "past"

type Exhibition = {
  id:          number
  title:       string
  subtitle:    string
  startDate:   string   // "YYYY-MM-DD"
  endDate:     string
  location:    string
  city:        string
  description: string
  status:      ExhibitionStatus
  link?:       string
}

/* ── Dados ────────────────────────────────────────────────── */
const exhibitions: Exhibition[] = [
  {
    id: 1,
    title:       "Além das Fronteiras",
    subtitle:    "Obras de quatro continentes",
    startDate:   "2025-08-01",
    endDate:     "2025-10-30",
    location:    "Galeria 1M2F — Ateliê",
    city:        "São Paulo, SP",
    description: "Uma retrospectiva das obras criadas durante as vivências de Maria França em mais de quatro continentes. Acrílico, porcelana e têxteis em diálogo com memórias e territórios.",
    status:      "upcoming",
  },
  {
    id: 2,
    title:       "Matéria e Sentimento",
    subtitle:    "Esculturas e telas 2024",
    startDate:   "2024-09-01",
    endDate:     "2024-11-15",
    location:    "Centro Cultural São Paulo",
    city:        "São Paulo, SP",
    description: "Exposição que explorou a relação entre matéria e emoção na obra de Maria França. Mais de 40 peças em acrílico sobre tela, aço e porcelana pintada à mão.",
    status:      "past",
  },
  {
    id: 3,
    title:       "Cores da Existência",
    subtitle:    "Pinturas e instalações",
    startDate:   "2024-03-15",
    endDate:     "2024-05-30",
    location:    "Museu de Arte Moderna",
    city:        "Rio de Janeiro, RJ",
    description: "Uma jornada visual pelas cores e texturas que definem a existência humana. A exposição reuniu obras inéditas criadas especialmente para este espaço.",
    status:      "past",
  },
  {
    id: 4,
    title:       "Espaços Internos",
    subtitle:    "Arte e arquitetura em diálogo",
    startDate:   "2023-10-01",
    endDate:     "2023-12-20",
    location:    "Galeria Vermelho",
    city:        "São Paulo, SP",
    description: "Colaboração entre Maria França e arquitetos para integrar obras de arte em projetos de interiores. Uma exploração de como a arte transforma ambientes e experiências.",
    status:      "past",
  },
  {
    id: 5,
    title:       "Fragmentos do Mundo",
    subtitle:    "Série Asia — obras sobre papel",
    startDate:   "2022-05-10",
    endDate:     "2022-07-15",
    location:    "Instituto Tomie Ohtake",
    city:        "São Paulo, SP",
    description: "Série criada a partir de vivências na Ásia. Obras sobre papel arroz com pigmentos naturais e técnicas mistas — uma das coleções mais intimistas de Maria França.",
    status:      "past",
  },
]

/* ── Utilitários ──────────────────────────────────────────── */
const MONTHS_PT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
]

function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split("-").map(Number)
  return `${MONTHS_PT[month - 1]} ${year}`
}

const STATUS_CONFIG: Record<ExhibitionStatus, { label: string; className: string }> = {
  upcoming: { label: "Próxima",  className: "exhBadge exhBadge--upcoming" },
  ongoing:  { label: "Em cartaz", className: "exhBadge exhBadge--ongoing"  },
  past:     { label: "Encerrada", className: "exhBadge exhBadge--past"     },
}

type FilterKey = "all" | ExhibitionStatus

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all",      label: "Todas"     },
  { key: "upcoming", label: "Próximas"  },
  { key: "ongoing",  label: "Em cartaz" },
  { key: "past",     label: "Encerradas"},
]

/* ── Componente ───────────────────────────────────────────── */
export default function ExposicoesPage() {
  const [filter, setFilter] = useState<FilterKey>("all")

  const visible = filter === "all"
    ? exhibitions
    : exhibitions.filter((e) => e.status === filter)

  const upcomingCount = exhibitions.filter((e) => e.status === "upcoming" || e.status === "ongoing").length

  return (
    <main className="page exhPage">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="pageHeader exhHeader">
        <div>
          <div className="aboutTag" style={{ marginBottom: "16px" }}>Agenda cultural</div>
          <h1 className="title" style={{ marginBottom: "8px" }}>Exposições</h1>
          <p className="pageSubtitle">
            {upcomingCount > 0
              ? `${upcomingCount} exposição${upcomingCount !== 1 ? "ões" : ""} em breve ou em cartaz`
              : `${exhibitions.length} exposições no histórico`}
          </p>
        </div>
        <Link href="/contact" className="heroButton">Propor parceria →</Link>
      </div>

      {/* ── Filtros ─────────────────────────────────────────── */}
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

      {/* ── Lista ───────────────────────────────────────────── */}
      {visible.length === 0 ? (
        <div className="galleryState">
          <p>Nenhuma exposição nesta categoria.</p>
          <button type="button" className="heroButton" onClick={() => setFilter("all")}>
            Ver todas →
          </button>
        </div>
      ) : (
        <div className="exhList">
          {visible.map((exh, i) => {
            const badge = STATUS_CONFIG[exh.status]
            return (
              <article
                key={exh.id}
                className={`exhCard${exh.status === "past" ? " exhCard--past" : ""}`}
                style={{ "--delay": `${i * 80}ms` } as React.CSSProperties}
              >
                {/* Coluna de datas */}
                <div className="exhDates">
                  <span className={badge.className}>{badge.label}</span>
                  <time className="exhDateRange">
                    {formatDate(exh.startDate)}
                    <span className="exhDateSep">—</span>
                    {formatDate(exh.endDate)}
                  </time>
                </div>

                {/* Divisor vertical */}
                <div className="exhDivider" />

                {/* Conteúdo */}
                <div className="exhContent">
                  <p className="exhSubtitle">{exh.subtitle}</p>
                  <h2 className="exhTitle">{exh.title}</h2>
                  <p className="exhLocation">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M12 21c-4-4-7-7.5-7-10.5a7 7 0 1 1 14 0C19 13.5 16 17 12 21z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    {exh.location} · {exh.city}
                  </p>
                  <p className="exhDescription">{exh.description}</p>

                  <div className="exhActions">
                    {exh.link && (
                      <a
                        href={exh.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="heroButton exhLink"
                      >
                        Saiba mais →
                      </a>
                    )}
                    {exh.status !== "past" && (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="exhCta">
        <div>
          <h2>Quer receber a agenda <em>completa</em>?</h2>
          <p>Entre em contato para saber sobre próximas exposições, vernissages e eventos exclusivos.</p>
        </div>
        <Link href="/contact" className="heroButton">Entrar em contato →</Link>
      </section>

    </main>
  )
}
