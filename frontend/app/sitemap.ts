import type { MetadataRoute } from "next"
import { getAllArtworks, getExhibitions } from "@/services/api"
import { SITE_URL } from "@/lib/config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL,                    lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/artworks`,      lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/exposicoes`,    lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${SITE_URL}/about`,         lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`,       lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/faq`,           lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ]

  const [artworkRoutes, exhibitionRoutes] = await Promise.all([
    getAllArtworks()
      .then((artworks) => artworks.map((art) => ({
        url:             `${SITE_URL}/artwork/${art.id}`,
        lastModified:    now,
        changeFrequency: "monthly" as const,
        priority:        0.8,
      })))
      .catch(() => []),

    getExhibitions()
      .then((exs) => exs.map((ex) => ({
        url:             `${SITE_URL}/exposicoes/${ex.id}`,
        lastModified:    now,
        changeFrequency: "monthly" as const,
        priority:        0.75,
      })))
      .catch(() => []),
  ])

  return [...staticRoutes, ...artworkRoutes, ...exhibitionRoutes]
}
