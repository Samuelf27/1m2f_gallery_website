"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getArtworks, getExhibitions, getTestimonials } from "@/services/api"
import type { Artwork } from "@/types/artwork.types"
import type { Exhibition } from "@/types/exhibition.types"
import type { Testimonial } from "@/types/testimonial.types"

type Metrics = {
  totalArtworks: number
  featuredArtworks: number
  availableArtworks: number
  soldArtworks: number
  totalExhibitions: number
  activeExhibitions: number
  totalTestimonials: number
  visibleTestimonials: number
  recentArtworks: Artwork[]
  categoryBreakdown: { category: string; count: number }[]
}

const shortcuts = [
  { href: "/admin/artworks/new", label: "Nova Obra", icon: "+" },
  { href: "/admin/exposicoes/new", label: "Nova Exposição", icon: "+" },
  { href: "/admin/depoimentos/new", label: "Novo Depoimento", icon: "+" },
  { href: "/admin/configuracoes", label: "Configurações", icon: "◉" },
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

        const catMap: Record<string, number> = {}
        artworks.forEach((a: Artwork) => {
          if (a.category) catMap[a.category] = (catMap[a.category] ?? 0) + 1
        })
        const categoryBreakdown = Object.entries(catMap)
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        setMetrics({
          totalArtworks:      artworks.length,
          featuredArtworks:   artworks.filter((a: Artwork) => a.featured).length,
          availableArtworks:  artworks.filter((a: Artwork) => a.available === "disponível").length,
          soldArtworks:       artworks.filter((a: Artwork) => a.available === "vendido").length,
          totalExhibitions:   exhibitions.length,
          activeExhibitions:  exhibitions.filter((e: Exhibition) => e.status === "em_cartaz").length,
          totalTestimonials:  testimonials.length,
          visibleTestimonials: testimonials.filter((t: Testimonial) => t.visible).length,
          recentArtworks:     [...artworks].reverse().slice(0, 5),
          categoryBreakdown,
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
          value={loading ? "—" : String(metrics?.soldArtworks ?? 0)}
          label="Vendidas"
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

      {/* Obras recentes + categorias */}
      {!loading && metrics && (
        <div className="adminTwoCol">

          {/* Obras recentes */}
          <div className="adminSection">
            <div className="adminSectionHeader">
              <h2 className="adminSectionTitle">Obras recentes</h2>
              <Link href="/admin/artworks" className="adminSectionLink">Ver todas →</Link>
            </div>
            <div className="adminRecentList">
              {metrics.recentArtworks.map((art) => (
                <Link key={art.id} href={`/admin/artworks/${art.id}`} className="adminRecentItem">
                  <div className="adminRecentImage">
                    <Image src={art.image_url} alt={art.title} fill style={{ objectFit: "cover" }} sizes="48px" />
                  </div>
                  <div className="adminRecentInfo">
                    <span className="adminRecentTitle">{art.title}</span>
                    <span className="adminRecentMeta">{art.category}{art.year ? ` · ${art.year}` : ""}</span>
                  </div>
                  <span className={`adminBadge ${art.available === "vendido" ? "adminBadge--red" : "adminBadge--green"}`}>
                    {art.available || "disponível"}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Categorias */}
          <div className="adminSection">
            <h2 className="adminSectionTitle">Top categorias</h2>
            <div className="adminCategoryList">
              {metrics.categoryBreakdown.map((item) => {
                const pct = Math.round((item.count / metrics.totalArtworks) * 100)
                return (
                  <div key={item.category} className="adminCategoryItem">
                    <div className="adminCategoryHeader">
                      <span className="adminCategoryName">{item.category}</span>
                      <span className="adminCategoryCount">{item.count}</span>
                    </div>
                    <div className="adminCategoryBar">
                      <div className="adminCategoryBarFill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      )}

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
          <AdminNavCard
            href="/admin/configuracoes"
            title="Configurações"
            description="Logo, identidade visual e preferências do site"
            icon="◉"
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