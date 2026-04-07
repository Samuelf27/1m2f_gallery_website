import { getArtworks } from "@/services/api"
import type { Artwork } from "@/types/artwork.types"
import Link from "next/link"
import Image from "next/image"

export const dynamic = "force-dynamic"

export default async function ArtworksPage() {
  const artworks = await getArtworks()

  return (
    <main className="page">
      <div className="sectionHeader">
        <h1 className="title">Coleção</h1>
        <p>{artworks.length} obras</p>
      </div>

      <div className="grid">
        {artworks.map((art: Artwork, index: number) => (
          <Link key={art.id} href={`/artwork/${art.id}`} className="card">
            <div className="imageWrapper fadeUp">
              <Image
                src={art.image_url}
                alt={art.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                loading={index < 6 ? "eager" : "lazy"}
              />
              <div className="cardOverlay">
                <div className="cardContent">
                  <h3>{art.title}</h3>
                  <span>{art.category}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}