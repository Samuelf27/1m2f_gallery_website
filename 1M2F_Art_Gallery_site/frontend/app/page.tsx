import { getArtworks } from "../services/api"

export default async function Home() {
  const artworks = await getArtworks()

  return (
    <main style={{ padding: "20px" }}>
      <h1>Galeria de Arte</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px"
      }}>
        {artworks.map((art: any) => (
          <div key={art.id} style={{
            border: "1px solid #ddd",
            padding: "10px"
          }}>
            <img
              src={art.image_url}
              alt={art.title}
              style={{ width: "100%" }}
            />
            <h3>{art.title}</h3>
            <p>{art.artist}</p>
          </div>
        ))}
      </div>
    </main>
  )
}