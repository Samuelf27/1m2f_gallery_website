import type { Artwork } from "@/types/artwork.types"
import type { Exhibition } from "@/types/exhibition.types"
import type { Testimonial } from "@/types/testimonial.types"
import { API_URL, EXHIBITIONS_API_URL, TESTIMONIALS_API_URL } from "@/lib/config"

// ─── Artworks ────────────────────────────────────────────────────────────────

export async function getArtworks(): Promise<Artwork[]> {
  const res = await fetch(API_URL + "/")
  if (!res.ok) throw new Error("Erro ao buscar artworks")
  return res.json()
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