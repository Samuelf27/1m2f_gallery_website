"use client"

import { useState } from "react"

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main className="contactPage">

      <div className="contactLeft">
        <div className="contactTag">Fale conosco</div>
        <h1 className="contactTitle">
          Entre em<br /><em>contato</em>
        </h1>

        <div className="contactInfo">
          <div className="contactItem">
            <span>Telefone</span>
            <a href="tel:+5511999449449">+55 11 999 449 449</a>
          </div>
          <div className="contactItem">
            <span>E-mail</span>
            <a href="mailto:m.franca@1m2f-art-gallery.com">m.franca@1m2f-art-gallery.com</a>
          </div>
          <div className="contactItem">
            <span>Instagram</span>
            <a href="https://www.instagram.com/1m2f_art_gallery/" target="_blank">@1m2f_art_gallery</a>
          </div>
          <div className="contactItem">
            <span>Localização</span>
            <span>São Paulo, Brasil</span>
          </div>
        </div>
      </div>

      {sent ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 300, color: "var(--gold)" }}>
            Mensagem enviada.<br />Em breve entraremos em contato.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contactForm">
          <input type="text" placeholder="Nome" required />
          <input type="email" placeholder="E-mail" required />
          <input type="text" placeholder="Assunto" />
          <textarea placeholder="Mensagem" required />
          <button type="submit">Enviar mensagem →</button>
        </form>
      )}

    </main>
  )
}
