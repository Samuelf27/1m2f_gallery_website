import ArtworkCard from "./ArtworkCard"

export default function GalleryGrid({ artworks }) {

  return (
    <div className="gallery-grid">

      {artworks.map((art) => (
        <ArtworkCard key={art.id} art={art} />
      ))}

    </div>
  )
}