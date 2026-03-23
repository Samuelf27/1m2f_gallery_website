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

    </main>
  )
}