"use client"

import { useState } from "react"

type State = "idle" | "loading" | "success" | "error"

export default function Newsletter() {
  const [email, setEmail]   = useState("")
  const [state, setState]   = useState<State>("idle")
  const [touched, setTouched] = useState(false)

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const showErr = touched && email.length > 0 && !isValid

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) { setTouched(true); return }
    setState("loading")
    // Simula envio — trocar pela integração real (Mailchimp, Resend, etc.)
    await new Promise((r) => setTimeout(r, 1200))
    setState("success")
  }

  return (
    <section className="newsletterSection">
      <div className="newsletterInner">
        <div className="newsletterText">
          <p className="newsletterLabel">Agenda & novidades</p>
          <h2 className="newsletterTitle">
            Receba as próximas <em>exposições</em> em primeira mão
          </h2>
          <p className="newsletterDesc">
            Vernissages, lançamentos de coleção e obras exclusivas — direto na sua caixa de entrada.
          </p>
        </div>

        {state === "success" ? (
          <div className="newsletterSuccess">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <p>Inscrito! Obrigado pelo interesse.</p>
          </div>
        ) : (
          <form className="newsletterForm" onSubmit={submit} noValidate>
            <div className="newsletterInputWrapper">
              <input
                type="email"
                className={`newsletterInput${showErr ? " newsletterInput--error" : ""}`}
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                autoComplete="email"
                required
                aria-label="Endereço de e-mail"
                disabled={state === "loading"}
              />
              {showErr && (
                <p className="newsletterError">Digite um e-mail válido</p>
              )}
            </div>
            <button
              type="submit"
              className="newsletterBtn"
              disabled={state === "loading"}
            >
              {state === "loading" ? (
                <span className="newsletterSpinner" />
              ) : (
                "Inscrever →"
              )}
            </button>
          </form>
        )}

        {state === "error" && (
          <p className="newsletterErrorMsg">Algo deu errado. Tente novamente.</p>
        )}
      </div>
    </section>
  )
}
