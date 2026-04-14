"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getArtworks, getExhibitions, getTestimonials } from "@/services/api"
import type { Artwork } from "@/types/artwork.types"
import type { Exhibition } from "@/types/exhibition.types"
import type { Testimonial } from "@/types/testimonial.types"

type Metrics = {
  totalArtworks: number
  featuredArtworks: number
  availableArtworks: number
  totalExhibitions: number
  activeExhibitions: number
  totalTestimonials: number
  visibleTestimonials: number
}

const shortcuts = [
  { href: "/admin/artworks/new", label: "Nova Obra", icon: "+" },
  { href: "/admin/exposicoes/new", label: "Nova Exposição", icon: "+" },
  { href: "/admin/depoimentos/new", label: "Novo Depoimento", icon: "+" },
]

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [artworks, exhibitions, testimonials] = await Promise.all([
          getArtworks(),
          getExhibitions(),
          getTestimonials(),
        ])

        setMetrics({
          totalArtworks: artworks.length,
          featuredArtworks: artworks.filter((a: Artwork) => a.featured).length,
          availableArtworks: artworks.filter((a: Artwork) => a.available === "disponível").length,
          totalExhibitions: exhibitions.length,
          activeExhibitions: exhibitions.filter((e: Exhibition) => e.status === "em_cartaz").length,
          totalTestimonials: testimonials.length,
          visibleTestimonials: testimonials.filter((t: Testimonial) => t.visible).length,
        })
      } catch {
        // silently fail — metrics are informational
      } finally {
        setLoading(false)
      }
    }
    loadMetrics()
  }, [])

  return (
    <div className="adminPage">
      <div className="adminPageHeader">
        <div>
          <p className="adminPageLabel">Painel</p>
          <h1>Dashboard</h1>
        </div>
      </div>

      {/* Metrics */}
      <div className="adminMetrics">
        <MetricCard
          value={loading ? "—" : String(metrics?.totalArtworks ?? 0)}
          label="Total de obras"
          href="/admin/artworks"
        />
        <MetricCard
          value={loading ? "—" : String(metrics?.featuredArtworks ?? 0)}
          label="Em destaque"
          href="/admin/artworks"
        />
        <MetricCard
          value={loading ? "—" : String(metrics?.availableArtworks ?? 0)}
          label="Disponíveis"
          href="/admin/artworks"
        />
        <MetricCard
          value={loading ? "—" : String(metrics?.totalExhibitions ?? 0)}
          label="Exposições"
          href="/admin/exposicoes"
        />
        <MetricCard
          value={loading ? "—" : String(metrics?.activeExhibitions ?? 0)}
          label="Em cartaz"
          href="/admin/exposicoes"
        />
        <MetricCard
          value={loading ? "—" : String(metrics?.visibleTestimonials ?? 0)}
          label="Depoimentos visíveis"
          href="/admin/depoimentos"
        />
      </div>

      {/* Quick actions */}
      <div className="adminSection">
        <h2 className="adminSectionTitle">Ações rápidas</h2>
        <div className="adminShortcuts">
          {shortcuts.map((s) => (
            <Link key={s.href} href={s.href} className="adminShortcut">
              <span className="adminShortcutIcon">{s.icon}</span>
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation cards */}
      <div className="adminSection">
        <h2 className="adminSectionTitle">Gerenciar conteúdo</h2>
        <div className="adminNavCards">
          <AdminNavCard
            href="/admin/artworks"
            title="Obras"
            description="Adicione, edite ou remova obras do acervo"
            icon="◻"
          />
          <AdminNavCard
            href="/admin/exposicoes"
            title="Exposições"
            description="Gerencie as exposições com status automático"
            icon="◇"
          />
          <AdminNavCard
            href="/admin/depoimentos"
            title="Depoimentos"
            description="Controle depoimentos e visibilidade"
            icon="◎"
          />
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  value,
  label,
  href,
}: {
  value: string
  label: string
  href: string
}) {
  return (
    <Link href={href} className="adminMetricCard">
      <div className="adminMetricValue">{value}</div>
      <div className="adminMetricLabel">{label}</div>
    </Link>
  )
}

function AdminNavCard({
  href,
  title,
  description,
  icon,
}: {
  href: string
  title: string
  description: string
  icon: string
}) {
  return (
    <Link href={href} className="adminNavCard">
      <span className="adminNavCardIcon">{icon}</span>
      <div>
        <h3 className="adminNavCardTitle">{title}</h3>
        <p className="adminNavCardDesc">{description}</p>
      </div>
      <span className="adminNavCardArrow">→</span>
    </Link>
  )
}