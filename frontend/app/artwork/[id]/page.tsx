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

      <style jsx>{`
        .page {
          background: #0e0e0e;
          color: #fff;
          min-height: 100vh;
        }

        .back {
          padding: 30px 60px;
        }

        .back a {
          color: #aaa;
          text-decoration: none;
          transition: 0.3s;
        }

        .back a:hover {
          color: #fff;
        }

        .container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          padding: 40px 60px;
          align-items: center;
        }

        .imageWrapper {
          overflow: hidden;
          border-radius: 12px;
        }

        .imageWrapper img {
          width: 100%;
          height: 80vh;
          object-fit: cover;
          transition: transform 0.8s ease;
        }

        .imageWrapper:hover img {
          transform: scale(1.05);
        }

        .info {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        h1 {
          font-size: 48px;
          margin-bottom: 10px;
          font-family: 'Playfair Display', serif;
        }

        h2 {
          color: #aaa;
          margin-bottom: 30px;
          font-size: 20px;
        }

        .description {
          line-height: 1.7;
          color: #ccc;
          margin-bottom: 30px;
        }

        .details p {
          margin-bottom: 10px;
        }

        .details span {
          color: #777;
          margin-right: 10px;
        }

        /* RESPONSIVO */
        @media (max-width: 768px) {
          .container {
            grid-template-columns: 1fr;
          }

          .imageWrapper img {
            height: 60vh;
          }
        }
      `}</style>

    </main>
  )
}