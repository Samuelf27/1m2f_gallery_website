import type { MetadataRoute } from "next"
import { getArtworks } from "@/services/api"
import { SITE_URL } from "@/lib/config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url:             SITE_URL,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        1.0,
    },
    {
      url:             `${SITE_URL}/artworks`,
      lastModified:    now,
      changeFrequency: "daily",
      priority:        0.9,
    },
    {
      url:             `${SITE_URL}/about`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.7,
    },
    {
      url:             `${SITE_URL}/contact`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.6,
    },
  ]

  try {
    const artworks = await getArtworks()
    const artworkRoutes: MetadataRoute.Sitemap = artworks.map((art) => ({
      url:             `${SITE_URL}/artwork/${art.id}`,
      lastModified:    now,
      changeFrequency: "monthly" as const,
      priority:        0.8,
    }))
    return [...staticRoutes, ...artworkRoutes]
  } catch {
    // Se a API falhar no build, retorna só as rotas estáticas
    return staticRoutes
  }
}
