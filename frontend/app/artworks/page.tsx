import { getArtworks } from "../../services/api"
import Link from "next/link"

export default async function ArtworksPage() {
  const artworks = await getArtworks()

  return (
    <main style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "30px" }}>
        Artworks
      </h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "30px"
      }}>
        {artworks.map((art: any) => (
          <Link key={art.id} href={`/artwork/${art.id}`}>
            <img src={art.image_url} />
          </Link>
        ))}
      </div>
    </main>
  )
}