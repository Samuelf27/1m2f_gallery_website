import type { Artwork } from "@/types/artwork.types"
import { API_URL } from "@/lib/config"

export async function getArtworks(): Promise<Artwork[]> {
  const res = await fetch(API_URL + "/")

  if (!res.ok) {
    throw new Error("Erro ao buscar artworks")
  }

  return res.json()
}

export async function getArtwork(id: string): Promise<Artwork> {
  const res = await fetch(`${API_URL}/${id}`)

  if (!res.ok) {
    throw new Error("Erro ao buscar artwork")
  }

  return res.json()
}