"use client"

import { useState } from "react"

type Status = "idle" | "loading" | "sent" | "error"

export default function ContactForm({ waUrl }: { waUrl: string }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [status, setStatus] = useState<Status>("idle")
  const [errMsg, setErrMsg] = useState("")

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setStatus("loading")
    setErrMsg("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrMsg(data.error ?? "Erro ao enviar mensagem.")
        setStatus("error")
      } else {
        setStatus("sent")
      }
    } catch {
      setErrMsg("Sem conexão. Tente pelo WhatsApp.")
      setStatus("error")
    }
  }

  function openWhatsApp() {
    const msg = encodeURIComponent(
      `Olá! Me chamo ${form.name}.\n\nAssunto: ${form.subject || "Contato"}\n\n${form.message}\n\nE-mail para retorno: ${form.email}`
    )
    window.open(`${waUrl}?text=${msg}`, "_blank")
  }

  if (status === "sent") {
    return (
      <div className="contactSent">
        <div className="contactSentIcon">✓</div>
        <p>Mensagem enviada com sucesso!<br />Responderemos em até 24h.</p>
        <button
          type="button"
          className="contactResetBtn"
          onClick={() => { setStatus("idle"); setForm({ name: "", email: "", subject: "", message: "" }) }}
        >
          Enviar outra mensagem
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="contactForm">
      <div className="contactFormField">
        <input type="text"  name="name"    placeholder="Nome *"    value={form.name}    onChange={handleChange} required />
      </div>
      <div className="contactFormField">
        <input type="email" name="email"   placeholder="E-mail *"  value={form.email}   onChange={handleChange} required />
      </div>
      <div className="contactFormField">
        <input type="text"  name="subject" placeholder="Assunto"   value={form.subject} onChange={handleChange} />
      </div>
      <div className="contactFormField">
        <textarea name="message" placeholder="Mensagem *" value={form.message} onChange={handleChange} required rows={5} />
      </div>

      {status === "error" && (
        <p className="contactFormError">{errMsg}</p>
      )}

      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Enviando…" : "Enviar mensagem →"}
      </button>

      <button type="button" className="contactWhatsAppBtn" onClick={openWhatsApp}>
        Ou enviar pelo WhatsApp
      </button>
    </form>
  )
}
