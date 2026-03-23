"use client"

export const dynamic = "force-dynamic"
export default function About() {
  return (
    <main className="page">

      {/* HERO */}
      <section className="hero">
        <div className="heroContent">
          <h1>Maria França</h1>
          <p>Contemporary Artist</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="content">

        <div className="text">
          <h2>About the Artist</h2>

          <p>
            Maria França is a contemporary artist whose work explores
            identity, emotion, and visual storytelling through modern
            techniques and expressive compositions.
          </p>

          <p>
            Her creations reflect a deep connection between abstraction
            and human experience, blending texture, color, and form
            to create immersive visual narratives.
          </p>

          <p>
            Based in São Paulo, her work has been featured in exhibitions
            and private collections, capturing the attention of collectors
            and art enthusiasts worldwide.
          </p>
        </div>

        <div className="image">
          <img src="https://images.unsplash.com/photo-1492724441997-5dc865305da7" />
        </div>

      </section>

      {/* QUOTE */}
      <section className="quote">
        <p>
          "Art is not what you see, but what you make others see."
        </p>
      </section>

      <style jsx>{`
        .page {
          background: #0e0e0e;
          color: #fff;
          font-family: Inter, sans-serif;
        }

        /* HERO */
        .hero {
          height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: linear-gradient(to bottom, #0e0e0e, #000);
        }

        .heroContent h1 {
          font-size: 60px;
          font-family: 'Playfair Display', serif;
        }

        .heroContent p {
          margin-top: 10px;
          color: #aaa;
          letter-spacing: 2px;
        }

        /* CONTENT */
        .content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          padding: 100px 60px;
          align-items: center;
        }

        .text h2 {
          font-size: 32px;
          margin-bottom: 20px;
          font-family: 'Playfair Display', serif;
        }

        .text p {
          color: #ccc;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .image img {
          width: 100%;
          height: 500px;
          object-fit: cover;
        }

        /* QUOTE */
        .quote {
          padding: 100px 60px;
          text-align: center;
          font-size: 24px;
          font-style: italic;
          color: #aaa;
        }

        /* RESPONSIVO */
        @media (max-width: 768px) {
          .content {
            grid-template-columns: 1fr;
          }

          .heroContent h1 {
            font-size: 40px;
          }
        }
      `}</style>

    </main>
  )
}