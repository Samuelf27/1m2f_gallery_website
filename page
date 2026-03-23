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
      const scrollY = window.scrollY
      if (scrollY > 200) setVisible(true)
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

              <div className={`imageWrapper ${visible ? "fadeUp" : ""}`} style={{ transitionDelay: `${index * 0.1}s` }}>
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

      <footer className="footer">
        © 2026 1M2F Gallery — All rights reserved
      </footer>

      <style jsx>{`
        .page {
          background: #0e0e0e;
          color: #fff;
          font-family: Inter, sans-serif;
        }

        /* NAVBAR */
        .header {
          position: fixed;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 60px;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(12px);
          z-index: 1000;
        }

        .logo {
          font-family: 'Playfair Display', serif;
          letter-spacing: 2px;
          font-size: 20px;
        }

        .nav {
          display: flex;
          gap: 30px;
        }

        .nav a {
          text-decoration: none;
          color: #ccc;
          font-size: 14px;
          position: relative;
          transition: 0.3s;
        }

        .nav a::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -5px;
          width: 0%;
          height: 1px;
          background: #fff;
          transition: 0.3s;
        }

        .nav a:hover {
          color: #fff;
        }

        .nav a:hover::after {
          width: 100%;
        }

        /* HERO */
        .hero {
          height: 100vh;
          background: url('https://images.unsplash.com/photo-1541961017774-22349e4a1262') center/cover;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .heroContent {
          background: rgba(0,0,0,0.55);
          padding: 50px 60px;
          border-radius: 12px;
          backdrop-filter: blur(6px);
          animation: fadeIn 1.2s ease;
        }

        .hero h2 {
          font-size: 52px;
          font-family: 'Playfair Display', serif;
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
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
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
          transition: all 0.6s ease;
        }

        .imageWrapper img {
          width: 100%;
          height: 380px;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 20px;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          opacity: 0;
          transform: translateY(20px);
          transition: 0.4s ease;
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

        .imageWrapper:hover img {
          transform: scale(1.1);
        }

        .imageWrapper:hover .overlay {
          opacity: 1;
          transform: translateY(0);
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
