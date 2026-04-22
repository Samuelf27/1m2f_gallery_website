import type { Metadata } from "next"
import { getExhibition, getExhibitions } from "@/services/api"
import { SITE_URL } from "@/lib/config"
import Link from "next/link"
import { notFound } from "next/navigation"

/* ── Helpers ──────────────────────────────────────────────── */
const MONTHS_PT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  const [year, month, day] = dateStr.split("-").map(Number)
  return `${day} ${MONTHS_PT[month - 1]} ${year}`
}

function toCalDate(d: string) { return d.replace(/-/g, "") }

function googleCalUrl(title: string, start: string, end: string, desc: string, loc: string) {
  const p = new URLSearchParams({ action: "TEMPLATE", text: title, dates: `${toCalDate(start)}/${toCalDate(end)}`, details: desc, location: loc })
  return `https://calendar.google.com/calendar/render?${p}`
}

const STATUS_CONFIG = {
  proxima:    { label: "Próxima",   cls: "exhBadge exhBadge--upcoming" },
  em_cartaz:  { label: "Em cartaz", cls: "exhBadge exhBadge--ongoing"  },
  encerrada:  { label: "Encerrada", cls: "exhBadge exhBadge--past"     },
  indefinida: { label: "Sem data",  cls: "exhBadge exhBadge--past"     },
} as const

/* ── Metadata ─────────────────────────────────────────────── */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  try {
    const exh = await getExhibition(id)
    return {
      title: `${exh.title} — Exposição`,
      description: exh.description ?? `Exposição "${exh.title}" de Maria França. ${exh.location ?? ""}`,
      openGraph: {
        title: `${exh.title} — 1M2F Gallery`,
        description: exh.description ?? "",
        url: `${SITE_URL}/exposicoes/${id}`,
      },
    }
  } catch {
    return { title: "Exposição não encontrada" }
  }
}

export async function generateStaticParams() {
  try {
    const exhs = await getExhibitions()
    return exhs.map((e) => ({ id: String(e.id) }))
  } catch {
    return []
  }
}

/* ── Página ───────────────────────────────────────────────── */
export default async function ExhibitionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let exh
  try { exh = await getExhibition(id) } catch { notFound() }

  const badge   = STATUS_CONFIG[exh.status]
  const isPast  = exh.status === "encerrada" || exh.status === "indefinida"
  const hasDates = exh.start_date && exh.end_date

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ExhibitionEvent",
    name: exh.title,
    description: exh.description ?? undefined,
    startDate: exh.start_date ?? undefined,
    endDate: exh.end_date ?? undefined,
    location: exh.location ? { "@type": "Place", name: exh.location } : undefined,
    organizer: { "@type": "Person", name: "Maria França", url: `${SITE_URL}/about` },
    url: `${SITE_URL}/exposicoes/${id}`,
  }

  return (
    <main className="page exhPage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Breadcrumb ──────────────────────────────────────── */}
      <nav className="exhDetailBreadcrumb" aria-label="Navegação">
        <Link href="/exposicoes">← Exposições</Link>
      </nav>

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="exhDetailHeader">
        <span className={badge.cls}>{badge.label}</span>
        {exh.subtitle && <p className="exhSubtitle">{exh.subtitle}</p>}
        <h1 className="exhDetailTitle">{exh.title}</h1>
      </div>

      {/* ── Meta grid ───────────────────────────────────────── */}
      <div className="exhDetailMeta">
        {hasDates && (
          <div className="exhDetailMetaItem">
            <span className="exhDetailMetaLabel">Período</span>
            <span className="exhDetailMetaValue">
              {formatDate(exh.start_date)} — {formatDate(exh.end_date)}
            </span>
          </div>
        )}
        {exh.location && (
          <div className="exhDetailMetaItem">
            <span className="exhDetailMetaLabel">Local</span>
            <span className="exhDetailMetaValue">{exh.location}</span>
          </div>
        )}
        <div className="exhDetailMetaItem">
          <span className="exhDetailMetaLabel">Artista</span>
          <span className="exhDetailMetaValue">Maria França</span>
        </div>
      </div>

      {/* ── Descrição ───────────────────────────────────────── */}
      {exh.description && (
        <div className="exhDetailBody">
          <p>{exh.description}</p>
        </div>
      )}

      {/* ── Ações ───────────────────────────────────────────── */}
      {!isPast && hasDates && (
        <div className="exhActions exhDetailActions">
          <a
            href={googleCalUrl(exh.title, exh.start_date!, exh.end_date!, exh.description ?? "", exh.location ?? "")}
            target="_blank"
            rel="noopener noreferrer"
            className="exhCalBtn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            Adicionar ao Google Calendar
          </a>
        </div>
      )}

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="exhCta" style={{ marginTop: "64px" }}>
        <div>
          <h2>Interesse nesta exposição?</h2>
          <p>Entre em contacto para mais informações, catálogos ou visitas guiadas.</p>
        </div>
        <Link href="/contact" className="heroButton">Entrar em contacto →</Link>
      </section>
    </main>
  )
}
