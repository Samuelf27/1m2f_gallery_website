"use client"

export const dynamic = "force-dynamic"

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

      <style jsx>{`
        .page {
          padding: 80px 60px;
          background: #0e0e0e;
          color: #fff;
        }

        .title {
          font-size: 40px;
          margin-bottom: 50px;
          font-family: 'Playfair Display', serif;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 40px;
        }

        .imageWrapper {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .imageWrapper img {
          width: 100%;
          height: 420px;
          object-fit: cover;
          transition: transform 0.7s ease, filter 0.5s ease;
        }

        .imageWrapper:hover img {
          transform: scale(1.08);
          filter: brightness(0.8);
        }

        .overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 25px;
          background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
          opacity: 0;
          transform: translateY(20px);
          transition: 0.4s ease;
        }

        .imageWrapper:hover .overlay {
          opacity: 1;
          transform: translateY(0);
        }

        .overlay h3 {
          margin: 0;
          font-size: 18px;
        }

        .overlay p {
          margin-top: 5px;
          color: #ccc;
          font-size: 14px;
        }
      `}</style>
    </main>
  )
}