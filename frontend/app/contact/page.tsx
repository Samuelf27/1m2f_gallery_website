"use client"

import { useState } from "react"
import { WHATSAPP_URL } from "@/lib/config"

const contactItems = [
  { label: "Telefone / WhatsApp", value: "+55 11 999 449 449", href: WHATSAPP_URL },
  { label: "E-mail", value: "m.franca@1m2f-art-gallery.com", href: "mailto:m.franca@1m2f-art-gallery.com" },
  { label: "Instagram", value: "@1m2f_art_gallery", href: "https://www.instagram.com/1m2f_art_gallery/" },
  { label: "YouTube", value: "1M2F Art Gallery", href: "https://www.youtube.com/@1M2FArtGallery-MariaFran%C3%A7a" },
  { label: "Localização", value: "São Paulo, Brasil", href: null },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setLoading(true)

    // Redireciona para WhatsApp com a mensagem preenchida
    const msg = encodeURIComponent(
      `Olá! Me chamo ${form.name}.\n\nAssunto: ${form.subject || "Contato"}\n\n${form.message}\n\nE-mail para retorno: ${form.email}`
    )
    window.open(`${WHATSAPP_URL}?text=${msg}`, "_blank")

    setTimeout(() => {
      setSent(true)
      setLoading(false)
    }, 400)
  }

  return (
    <main className="contactPage">

      <div className="contactLeft">
        <div className="contactTag">Fale conosco</div>
        <h1 className="contactTitle">
          Entre em<br /><em>contato</em>
        </h1>
        <p className="contactDesc">
          Adquira uma obra, encomende uma peça exclusiva ou tire suas dúvidas. Respondemos em até 24h.
        </p>

        <div className="contactInfo">
          {contactItems.map((item) => (
            <div key={item.label} className="contactItem">
              <span>{item.label}</span>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {item.value}
                </a>
              ) : (
                <span className="contactItemValue">{item.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {sent ? (
        <div className="contactSent">
          <div className="contactSentIcon">✓</div>
          <p>Mensagem enviada.<br />Em breve entraremos em contato.</p>
          <button
            type="button"
            className="contactResetBtn"
            onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }) }}
          >
            Enviar outra mensagem
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contactForm">
          <div className="contactFormField">
            <input
              type="text"
              name="name"
              placeholder="Nome"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="contactFormField">
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="contactFormField">
            <input
              type="text"
              name="subject"
              placeholder="Assunto"
              value={form.subject}
              onChange={handleChange}
            />
          </div>
          <div className="contactFormField">
            <textarea
              name="message"
              placeholder="Mensagem"
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Abrindo WhatsApp..." : "Enviar via WhatsApp →"}
          </button>
          <p className="contactFormNote">Você será redirecionado para o WhatsApp.</p>
        </form>
      )}

    </main>
  )
}