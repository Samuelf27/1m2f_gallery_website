"use client"

import { useEffect, useState } from "react"
import { getArtwork } from "../../../services/api"

export default function ArtworkPage({ params }: any) {
  const [art, setArt] = useState<any>(null)

  useEffect(() => {
    getArtwork(params.id).then(setArt)
  }, [params.id])

  if (!art) return <p style={{ padding: 40 }}>Carregando...</p>

  return (
    <main className="artPage">

      <div className="artHero">
        <img src={art.image_url} alt={art.title} />
      </div>

      <div className="artInfo">
        <h1>{art.title}</h1>
        <h3>{art.artist}</h3>

        <p>{art.description}</p>

        <div className="meta">
          <span>{art.year}</span>
          <span>{art.category}</span>
        </div>
      </div>

    </main>
  )
}