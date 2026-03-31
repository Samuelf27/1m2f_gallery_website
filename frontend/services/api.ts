import type { Artwork } from "@/types/artwork.types"

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/artworks"
    : "https://onem2f-gallery-website.onrender.com/api/artworks"

// GET — todas as obras
export async function getArtworks(): Promise<Artwork[]> {
  const res = await fetch(API_URL + "/")

  if (!res.ok) {
    throw new Error("Erro ao buscar artworks")
  }

  return res.json()
}

// GET — uma obra
export async function getArtwork(id: string): Promise<Artwork> {
  const res = await fetch(`${API_URL}/${id}`)

  if (!res.ok) {
    throw new Error("Erro ao buscar artwork")
  }

  return res.json()
}

// POST — criar obra
export async function createArtwork(data: Omit<Artwork, "id">): Promise<Artwork> {
  const res = await fetch(API_URL + "/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Erro ao criar artwork")
  }

  return res.json()
}

// PUT — editar obra
export async function updateArtwork(id: number, data: Partial<Artwork>): Promise<Artwork> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Erro ao atualizar artwork")
  }

  return res.json()
}

// DELETE — remover obra
export async function deleteArtwork(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    throw new Error("Erro ao deletar artwork")
  }
}
