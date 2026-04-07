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
    <main className="artworkPage">
      <Link href="/artworks" className="backLink">
        ← Voltar à galeria
      </Link>

      <div className="artworkDetail">
        <div className="artworkImageWrapper">
          <Image
            src={art.image_url}
            alt={art.title}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        <div className="artworkInfo">
          {art.category && (
            <span className="artworkCategory">{art.category}</span>
          )}
          <h1 className="artworkTitle">{art.title}</h1>
          {art.artist && <p className="artworkArtist">{art.artist}</p>}
          {art.year && <span className="artworkYear">{art.year}</span>}
          {art.description && (
            <p className="artworkDescription">{art.description}</p>
          )}
        </div>
      </div>
    </main>
  )
}