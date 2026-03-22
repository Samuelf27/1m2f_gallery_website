const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/artworks/"
    : "https://dummyjson.com/products" // TEMPORÁRIO PRA DEPLOY

// 🔥 pegar TODOS os artworks
export async function getArtworks() {
  const res = await fetch(API_URL)

  if (!res.ok) {
    throw new Error("Erro ao buscar artworks")
  }

  const data = await res.json()

  // adapta pra seu formato
  return data.products?.map((item: any) => ({
    id: item.id,
    title: item.title,
    artist: item.brand,
    image_url: item.thumbnail,
  })) || []
}

// 🔥 pegar UM artwork
export async function getArtwork(id: string) {
  const res = await fetch(
    process.env.NODE_ENV === "development"
      ? `${API_URL}${id}`
      : `https://dummyjson.com/products/${id}`
  )

  if (!res.ok) {
    throw new Error("Erro ao buscar artwork")
  }

  const item = await res.json()

  return {
    id: item.id,
    title: item.title,
    artist: item.brand,
    image_url: item.thumbnail,
    description: item.description,
    year: "2024",
    category: item.category,
  }
}