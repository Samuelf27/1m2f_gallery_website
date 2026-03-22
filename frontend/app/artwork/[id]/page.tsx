import { getArtwork } from "../../../services/api"
import Link from "next/link"

export default async function ArtworkPage({ params }: any) {
  const artwork = await getArtwork(params.id)

  return (
    <main style={{ background: "#0e0e0e", color: "#fff", minHeight: "100vh" }}>

      {/* BOTÃO VOLTAR */}
      <div style={{ padding: "30px 60px" }}>
        <Link href="/" style={{ color: "#aaa", textDecoration: "none" }}>
          ← Voltar
        </Link>
      </div>

      {/* CONTEÚDO */}
      <section style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "60px",
        padding: "40px 60px"
      }}>

        {/* IMAGEM */}
        <div style={{ overflow: "hidden" }}>
          <img
            src={artwork.image_url}
            alt={artwork.title}
            style={{
              width: "100%",
              height: "80vh",
              objectFit: "cover",
              borderRadius: "12px"
            }}
          />
        </div>

        {/* INFORMAÇÕES */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          
          <h1 style={{
            fontSize: "42px",
            marginBottom: "10px",
            fontFamily: "Playfair Display, serif"
          }}>
            {artwork.title}
          </h1>

          <h2 style={{
            color: "#aaa",
            marginBottom: "30px",
            fontSize: "20px"
          }}>
            {artwork.artist}
          </h2>

          <p style={{
            lineHeight: "1.6",
            color: "#ccc",
            marginBottom: "20px"
          }}>
            {artwork.description}
          </p>

          <p><strong>Ano:</strong> {artwork.year}</p>
          <p><strong>Categoria:</strong> {artwork.category}</p>

        </div>

      </section>

    </main>
  )
}