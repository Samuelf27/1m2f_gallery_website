const API_URL = "http://localhost:5000/api/artworks/"

export async function getArtworks() {
  const res = await fetch(API_URL)

  if (!res.ok) {
    throw new Error("Erro ao buscar artworks")
  }

  return res.json()
}
