"use client"

import { useEffect, useState } from "react"
import { getArtwork } from "@/services/api"

export default function ArtworkPage({ params }: any) {
  const [art, setArt] = useState<any>(null)

  useEffect(() => {
    getArtwork(params.id).then(setArt)
  }, [params.id])

  if (!art) {
    return <div className="loading">Carregando...</div>
  }

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