import { getArtworks } from "../../services/api"
import Link from "next/link"

export default async function ArtworksPage() {
  const artworks = await getArtworks()

  return (
    <main style={{ padding: 60, background: "#0e0e0e", color: "#fff" }}>
      <h1>Artworks</h1>

      {artworks.map((art: any) => (
        <Link key={art.id} href={`/artwork/${art.id}`}>
          <p>{art.title}</p>
        </Link>
      ))}
    </main>
  )
}