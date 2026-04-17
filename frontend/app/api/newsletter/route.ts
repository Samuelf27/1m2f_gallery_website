import { NextRequest, NextResponse } from "next/server"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 })
  }

  const email = typeof body === "object" && body !== null && "email" in body
    ? String((body as { email: unknown }).email).trim().toLowerCase()
    : ""

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 422 })
  }

  const apiKey    = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID

  // Sem chave configurada — falha silenciosa em dev, erro em prod
  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[newsletter] Simulando inscrição: ${email}`)
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: "Serviço de e-mail não configurado." }, { status: 503 })
  }

  try {
    const endpoint = audienceId
      ? `https://api.resend.com/audiences/${audienceId}/contacts`
      : "https://api.resend.com/emails"

    const body = audienceId
      ? JSON.stringify({ email, unsubscribed: false })
      : JSON.stringify({
          from: "newsletter@1m2f-gallery.com",
          to: [email],
          subject: "Bem-vindo à newsletter 1M2F Gallery",
          html: "<p>Obrigado por subscrever a newsletter da <strong>Galeria 1M2F</strong>. Em breve receberás novidades sobre obras, exposições e eventos.</p>",
        })

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      // 409 = já está inscrito — tratar como sucesso
      if (res.status === 409) return NextResponse.json({ ok: true })
      console.error("[newsletter] Resend error:", err)
      return NextResponse.json({ error: "Erro ao realizar inscrição." }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[newsletter] Unexpected error:", err)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}
