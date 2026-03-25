const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/artworks/"
    : "https://onem2f-gallery-website.onrender.com/api/artworks/"

// 🔥 pegar TODOS os artworks
export async function getArtworks() {
  const res = await fetch(API_URL, { cache: "no-store" })

  if (!res.ok) {
    throw new Error("Erro ao buscar artworks")
  }

  return res.json()
}

// 🔥 pegar UM artwork
export async function getArtwork(id: string) {
  const res = await fetch(`${API_URL}${id}`, { cache: "no-store" })

  if (!res.ok) {
    throw new Error("Erro ao buscar artwork")
  }

  return res.json()
}