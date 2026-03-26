"use client"

import { useState } from "react"

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    alert("Mensagem enviada 🚀")
  }

  return (
    <main className="pageContainer">

      {/* HERO */}
      <section className="pageHero">
        <h1>Contato</h1>
        <p>Entre em contato com a galeria</p>
      </section>

      {/* FORM */}
      <section className="contactSection">
        <div className="contactWrapper">

          <div className="contactInfo">
            <h2>Vamos conversar</h2>
            <p>
              Tem alguma dúvida, proposta ou interesse em arte?
              Envie uma mensagem e responderemos o mais rápido possível.
            </p>

            <div className="contactDetails">
              <span>Email: contato@1m2f.com</span>
              <span>São Paulo, Brasil</span>
            </div>
          </div>

          <form className="contactForm" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Seu nome"
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Seu email"
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Sua mensagem"
              rows={5}
              onChange={handleChange}
              required
            />

            <button type="submit">Enviar mensagem</button>
          </form>

        </div>
      </section>

    </main>
  )
}