"use client"

import { useState } from "react"

export default function ContactForm({ waUrl }: { waUrl: string }) {
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" })
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setLoading(true)
    const msg = encodeURIComponent(
      `Olá! Me chamo ${form.name}.\n\nAssunto: ${form.subject || "Contato"}\n\n${form.message}\n\nE-mail para retorno: ${form.email}`
    )
    window.open(`${waUrl}?text=${msg}`, "_blank")
    setTimeout(() => { setSent(true); setLoading(false) }, 400)
  }

  if (sent) {
    return (
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
    )
  }

  return (
    <form onSubmit={handleSubmit} className="contactForm">
      <div className="contactFormField">
        <input type="text"  name="name"    placeholder="Nome"    value={form.name}    onChange={handleChange} required />
      </div>
      <div className="contactFormField">
        <input type="email" name="email"   placeholder="E-mail"  value={form.email}   onChange={handleChange} required />
      </div>
      <div className="contactFormField">
        <input type="text"  name="subject" placeholder="Assunto" value={form.subject} onChange={handleChange} />
      </div>
      <div className="contactFormField">
        <textarea name="message" placeholder="Mensagem" value={form.message} onChange={handleChange} required />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Abrindo WhatsApp..." : "Enviar via WhatsApp →"}
      </button>
      <p className="contactFormNote">Você será redirecionado para o WhatsApp.</p>
    </form>
  )
}
