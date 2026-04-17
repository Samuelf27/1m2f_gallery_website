import type { Artwork } from "@/types/artwork.types"
import type { Exhibition } from "@/types/exhibition.types"
import type { Testimonial } from "@/types/testimonial.types"
import { API_URL, EXHIBITIONS_API_URL, TESTIMONIALS_API_URL } from "@/lib/config"

// ─── Artworks ────────────────────────────────────────────────────────────────

type ArtworksParams = { page?: number; per_page?: number; category?: string; featured?: boolean }

function buildArtworksUrl(params?: ArtworksParams) {
  const query = new URLSearchParams()
  if (params?.page)                   query.set("page",     String(params.page))
  if (params?.per_page)               query.set("per_page", String(params.per_page))
  if (params?.category)               query.set("category", params.category)
  if (params?.featured !== undefined) query.set("featured", String(params.featured))
  return `${API_URL}/?${query.toString()}`
}

export async function getArtworks(params?: ArtworksParams): Promise<Artwork[]> {
  const res = await fetch(buildArtworksUrl(params))
  if (!res.ok) throw new Error("Erro ao buscar artworks")
  const data = await res.json()
  return Array.isArray(data) ? data : (data.items ?? [])
}

/** Busca todas as obras percorrendo todas as páginas do backend (máx 100/página). */
export async function getAllArtworks(): Promise<Artwork[]> {
  const res = await fetch(buildArtworksUrl({ per_page: 100, page: 1 }))
  if (!res.ok) throw new Error("Erro ao buscar artworks")
  const data = await res.json()

  if (Array.isArray(data)) return data

  const items: Artwork[] = data.items ?? []
  const totalPages: number = data.pages ?? 1

  if (totalPages <= 1) return items

  const remaining = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) =>
      fetch(buildArtworksUrl({ per_page: 100, page: i + 2 }))
        .then((r) => r.json())
        .then((d): Artwork[] => (Array.isArray(d) ? d : (d.items ?? [])))
    )
  )

  return [...items, ...remaining.flat()]
}

export async function getArtwork(id: string): Promise<Artwork> {
  const res = await fetch(`${API_URL}/${id}`)
  if (!res.ok) throw new Error("Erro ao buscar artwork")
  return res.json()
}

// ─── Exhibitions ─────────────────────────────────────────────────────────────

export async function getExhibitions(): Promise<Exhibition[]> {
  const res = await fetch(EXHIBITIONS_API_URL + "/")
  if (!res.ok) throw new Error("Erro ao buscar exposições")
  return res.json()
}

export async function getExhibition(id: string): Promise<Exhibition> {
  const res = await fetch(`${EXHIBITIONS_API_URL}/${id}`)
  if (!res.ok) throw new Error("Erro ao buscar exposição")
  return res.json()
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<Testimonial[]> {
  const res = await fetch(TESTIMONIALS_API_URL + "/")
  if (!res.ok) throw new Error("Erro ao buscar depoimentos")
  return res.json()
}

export async function getTestimonial(id: string): Promise<Testimonial> {
  const res = await fetch(`${TESTIMONIALS_API_URL}/${id}`)
  if (!res.ok) throw new Error("Erro ao buscar depoimento")
  return res.json()
}