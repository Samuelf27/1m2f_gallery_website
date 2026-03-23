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

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #0e0e0e;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
        }

        .container {
          width: 100%;
          max-width: 1100px;
        }

        h1 {
          font-size: 42px;
          margin-bottom: 10px;
          font-family: 'Playfair Display', serif;
        }

        .subtitle {
          color: #aaa;
          margin-bottom: 60px;
        }

        .contactGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
        }

        .info h3 {
          margin-top: 20px;
          font-size: 16px;
          color: #ccc;
        }

        .info p {
          margin-top: 5px;
          color: #fff;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        input, textarea {
          background: transparent;
          border: 1px solid #333;
          padding: 15px;
          color: #fff;
          outline: none;
          transition: 0.3s;
        }

        input:focus, textarea:focus {
          border-color: #fff;
        }

        button {
          background: #fff;
          color: #000;
          padding: 15px;
          border: none;
          cursor: pointer;
          transition: 0.3s;
        }

        button:hover {
          background: #ccc;
        }

        /* RESPONSIVO */
        @media (max-width: 768px) {
          .contactGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

    </main>
  )
}