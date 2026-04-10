import Image from "next/image"
import type { Artwork } from "@/types/artwork.types"

export default function ArtworkCard({ art }: { art: Artwork }) {
  return (
    <div className="art-card">
      <div className="art-card-image">
        <Image
          src={art.image_url}
          alt={art.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          loading="lazy"
        />
      </div>
      <h3>{art.title}</h3>
      <p>{art.artist}</p>
      <span>{art.year}</span>
    </div>
  )
}