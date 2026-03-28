import { getArtwork } from "@/services/api"
import type { Artwork } from "@/types/artwork.types"

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const art: Artwork = await getArtwork(id)

  return (
    <main className="artPage">

      {/* HERO IMAGEM */}
      <section className="artHero">
        <img src={art.image_url} alt={art.title} />
      </section>

      {/* INFO */}
      <section className="artContent">

        <div className="artHeader">
          <h1>{art.title}</h1>
          <p className="artist">{art.artist}</p>
        </div>

        <div className="artMeta">
          <span>{art.year}</span>
          <span>{art.category}</span>
        </div>

        <div className="artDescription">
          <p>{art.description}</p>
        </div>

      </section>

    </main>
  )
}
