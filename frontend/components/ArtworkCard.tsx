import type { Artwork } from "@/types/artwork.types"

export default function ArtworkCard({ art }: { art: Artwork }) {
  return (
    <div className="art-card">
      <img src={art.image_url} alt={art.title} />
      <h3>{art.title}</h3>
      <p>{art.artist}</p>
      <span>{art.year}</span>
    </div>
  )
}
