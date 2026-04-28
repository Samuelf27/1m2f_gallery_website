export type Artwork = {
  id: number
  title: string
  artist: string | null
  year: string
  description: string
  image_url: string
  category: string
  dimensions: string
  available: "disponível" | "vendido"
  featured: boolean
  sort_order: number | null
  created_at?: string
  updated_at?: string
}