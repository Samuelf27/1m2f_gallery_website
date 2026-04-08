import type { Metadata } from "next"
import { getArtworks } from "@/services/api"
import type { Artwork } from "@/types/artwork.types"
import Link from "next/link"
import Image from "next/image"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Galeria — 1M2F Gallery",
  description: "Explore a coleção completa de Maria França. Mais de 6.000 obras em acrílico, tela, porcelana e aço.",
}

export default async function ArtworksPage() {
  const artworks = await getArtworks()

  return (
    <main className="page">

      <div className="pageHeader">
        <div>
          <h1 className="title">Coleção</h1>
          <p className="pageSubtitle">{artworks.length} obras disponíveis</p>
        </div>
        <Link href="/contact" className="heroButton">Adquirir uma obra →</Link>
      </div>

      <div className="grid">
        {artworks.map((art: Artwork, index: number) => (
          <Link key={art.id} href={`/artwork/${art.id}`} className="card">
            <div className="imageWrapper fadeUp">
              <Image
                src={art.image_url}
                alt={art.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                loading={index < 4 ? "eager" : "lazy"}
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