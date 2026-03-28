import type { Artwork } from "@/types/artwork.types"
import ArtworkCard from "./ArtworkCard"

export default function GalleryGrid({ artworks }: { artworks: Artwork[] }) {
  return (
    <div className="gallery-grid">
      {artworks.map((art) => (
        <ArtworkCard key={art.id} art={art} />
      ))}
    </div>
  )
}
