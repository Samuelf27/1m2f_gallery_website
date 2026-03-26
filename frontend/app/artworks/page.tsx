"use client"

export const dynamic = "force-dynamic"

import "./globals.css"
import { getArtworks } from "../../services/api"
import Link from "next/link"

export default async function ArtworksPage() {
  const artworks = await getArtworks()

  return (
    <main className="page">
      <h1 className="title">Artworks</h1>

      <div className="grid">
        {artworks.map((art: any) => (
          <Link key={art.id} href={`/artwork/${art.id}`} className="card">

            <div className="imageWrapper">
              <img src={art.image_url} alt={art.title} />

              <div className="overlay">
                <h3>{art.title}</h3>
                <p>{art.artist}</p>
              </div>
            </div>

          </Link>
        ))}
      </div>

    </main>
  )
} 