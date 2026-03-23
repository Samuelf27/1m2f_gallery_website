"use client"

export const dynamic = "force-dynamic"

export default function Contact() {
  return (
    <main className="page">

      <section className="container">
        <h1>Contact</h1>

        <p className="subtitle">
          Interested in an artwork or collaboration? Get in touch.
        </p>

        <div className="contactGrid">

          {/* INFO */}
          <div className="info">
            <h3>Email</h3>
            <p>contact@1m2f.com</p>

            <h3>Instagram</h3>
            <p>@1m2f_gallery</p>

            <h3>Location</h3>
            <p>São Paulo, Brazil</p>
          </div>

          {/* FORM */}
          <form className="form">
            <input type="text" placeholder="Your name" />
            <input type="email" placeholder="Your email" />
            <textarea placeholder="Your message" rows={5}></textarea>

            <button type="submit">Send Message</button>
          </form>

        </div>
      </section>

    </main>
  )
}