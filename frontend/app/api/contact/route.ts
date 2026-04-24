import { NextRequest, NextResponse } from "next/server"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 })
  }

  const { name, email, subject, message } =
    (typeof body === "object" && body !== null ? body : {}) as Record<string, string>

  if (!name?.trim() || !EMAIL_RE.test(email ?? "") || !message?.trim()) {
    return NextResponse.json({ error: "Preencha todos os campos obrigatórios." }, { status: 422 })
  }

  const apiKey  = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "m.franca@1m2f-art-gallery.com"

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[contact] Dev: ${name} <${email}> — ${subject}`)
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: "Serviço de e-mail não configurado." }, { status: 503 })
  }

  const html = `
    <div style="font-family:sans-serif;max-width:600px">
      <h2 style="color:#c9a96e">Nova mensagem — 1M2F Gallery</h2>
      <table cellpadding="8" style="border-collapse:collapse;width:100%">
        <tr><td><strong>Nome</strong></td><td>${name}</td></tr>
        <tr><td><strong>E-mail</strong></td><td>${email}</td></tr>
        <tr><td><strong>Assunto</strong></td><td>${subject || "—"}</td></tr>
      </table>
      <hr style="margin:16px 0" />
      <p style="white-space:pre-wrap">${message.replace(/</g, "&lt;")}</p>
    </div>
  `

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:     "contato@1m2f-gallery.com",
        to:       [toEmail],
        reply_to: email,
        subject:  `[Contato] ${subject || "Mensagem"} — ${name}`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error("[contact] Resend error:", err)
      return NextResponse.json({ error: "Erro ao enviar e-mail." }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[contact] Unexpected:", err)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}
