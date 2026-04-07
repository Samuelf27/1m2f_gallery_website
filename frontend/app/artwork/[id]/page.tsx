import { getArtwork } from "@/services/api"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let art
  try {
    art = await getArtwork(id)
  } catch {
    notFound()
  }

  return (
    <main className="artPage">
      <div className="artHero">
        <Image
          src={art.image_url}
          alt={art.title}
          fill
          sizes="100vw"
          style={{ objectFit: "contain" }}
          priority
        />
        <div className="artHeroOverlay" />
      </div>

      <div className="artContent">
        <div className="artHeader">
          {art.category && (
            <div className="artCategory">{art.category}</div>
          )}
          <h1>{art.title}</h1>
          {art.artist && <p className="artist">{art.artist}</p>}
          {art.year && (
            <div className="artMeta">
              <span>{art.year}</span>
            </div>
          )}
        </div>

        <div className="artDetails">
          {art.description && (
            <p className="artDescription">{art.description}</p>
          )}
          <Link href="/artworks" className="backLink">
            ← Voltar à galeria
          </Link>
        </div>
      </div>
    </main>
  )
}