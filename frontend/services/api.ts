const API_URL = "http://localhost:5000/api/artworks/"

// 🔥 pegar TODOS os artworks
export async function getArtworks() {
  const res = await fetch(API_URL)

  if (!res.ok) {
    throw new Error("Erro ao buscar artworks")
  }

  return res.json()
}

// 🔥 pegar UM artwork
export async function getArtwork(id: string) {
  const res = await fetch(`${API_URL}${id}`)

  if (!res.ok) {
    throw new Error("Erro ao buscar artwork")
  }

  return res.json()
}