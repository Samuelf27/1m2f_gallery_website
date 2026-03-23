"use client"

export const dynamic = "force-dynamic"

import { getArtwork } from "../../../services/api"
import Link from "next/link"

export default async function ArtworkPage({ params }: any) {
  const artwork = await getArtwork(params.id)

  return (
    <main className="page">

      {/* VOLTAR */}
      <div className="back">
        <Link href="/">← Voltar</Link>
      </div>

      {/* CONTEÚDO */}
      <section className="container">

        {/* IMAGEM */}
        <div className="imageWrapper">
          <img src={artwork.image_url} alt={artwork.title} />
        </div>

        {/* INFO */}
        <div className="info">

          <h1>{artwork.title}</h1>
          <h2>{artwork.artist}</h2>

          <p className="description">
            {artwork.description}
          </p>

          <div className="details">
            <p><span>Ano</span> {artwork.year}</p>
            <p><span>Categoria</span> {artwork.category}</p>
          </div>

        </div>

      </section>

    </main>
  )
}