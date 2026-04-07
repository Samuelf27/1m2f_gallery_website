import type { Artwork } from "@/types/artwork.types"

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/artworks"
    : "https://onem2f-gallery-website.onrender.com/api/artworks"

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