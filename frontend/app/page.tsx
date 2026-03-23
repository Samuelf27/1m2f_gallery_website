"use client"

import { useEffect, useState } from "react"
import { getArtworks } from "../services/api"
import Link from "next/link"

export default function Home() {
  const [artworks, setArtworks] = useState([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    getArtworks().then(setArtworks)

    const handleScroll = () => {
      if (window.scrollY > 150) setVisible(true)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="page">

      {/* HERO */}
      <section className="hero">
        <div className="heroContent">
          <h2>Contemporary Art Experience</h2>
          <p>Descubra obras únicas e artistas contemporâneos</p>
        </div>
      </section>

      {/* GALERIA */}
      <section className={`gallery ${visible ? "show" : ""}`}>
        <h2>Galeria</h2>

        <div className="grid">
          {artworks.map((art: any, index) => (
            <Link key={art.id} href={`/artwork/${art.id}`} className="card">

              <div
                className={`imageWrapper ${visible ? "fadeUp" : ""}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <img src={art.image_url} alt={art.title} />

                <div className="overlay">
                  <h3>{art.title}</h3>
                  <p>{art.artist}</p>
                </div>
              </div>

            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        © 2026 1M2F Gallery — All rights reserved
      </footer>

      <style jsx>{`
        .page {
          background: #0e0e0e;
          color: #fff;
          font-family: Inter, sans-serif;
          scroll-behavior: smooth;
        }

        /* HERO */
        .hero {
          height: 100vh;
          background: url('https://images.unsplash.com/photo-1541961017774-22349e4a1262') center/cover no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
        }

        .hero::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.9));
        }

        .heroContent {
          position: relative;
          z-index: 2;
          max-width: 700px;
          animation: fadeIn 1.2s ease;
        }

        .hero h2 {
          font-size: 64px;
          font-family: 'Playfair Display', serif;
          letter-spacing: 2px;
        }

        .hero p {
          margin-top: 20px;
          color: #ccc;
          font-size: 18px;
        }

        /* GALERIA */
        .gallery {
          padding: 100px 60px;
          opacity: 0;
          transform: translateY(40px);
          transition: 0.8s ease;
        }

        .gallery.show {
          opacity: 1;
          transform: translateY(0);
        }

        .gallery h2 {
          font-size: 34px;
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
          opacity: 0;
          transform: translateY(30px);
        }

        .fadeUp {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .imageWrapper img {
          width: 100%;
          height: 420px;
          object-fit: cover;
          transition: transform 0.8s ease, filter 0.6s ease;
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
          transform: translateY(30px);
          transition: all 0.5s ease;
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

        .footer {
          text-align: center;
          padding: 40px;
          color: #666;
          border-top: 1px solid #222;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </main>
  )
}