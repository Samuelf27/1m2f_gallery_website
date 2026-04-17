import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title       = searchParams.get("title")       ?? "1M2F Gallery"
  const description = searchParams.get("description") ?? "Arte contemporânea de Maria França — São Paulo, Brasil"
  const label       = searchParams.get("label")       ?? "Arte Contemporânea"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#080808",
          padding: "72px 80px",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        {/* Faixa dourada lateral */}
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: "#c9a96e",
        }} />

        {/* Gradiente de fundo */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 80% 50%, rgba(201,169,110,0.06) 0%, transparent 60%)",
        }} />

        {/* Label */}
        <p style={{
          fontSize: 14,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: "#c9a96e",
          marginBottom: 32,
          display: "flex",
        }}>
          {label}
        </p>

        {/* Título */}
        <h1 style={{
          fontSize: title.length > 30 ? 56 : 72,
          fontWeight: 300,
          color: "#f0ede8",
          lineHeight: 1.1,
          marginBottom: 28,
          display: "flex",
          maxWidth: 800,
        }}>
          {title}
        </h1>

        {/* Descrição */}
        <p style={{
          fontSize: 22,
          fontWeight: 300,
          color: "rgba(240,237,232,0.55)",
          lineHeight: 1.6,
          maxWidth: 680,
          display: "flex",
        }}>
          {description}
        </p>

        {/* Rodapé — nome do site */}
        <div style={{
          position: "absolute",
          bottom: 56,
          right: 80,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <div style={{
            width: 32,
            height: 0.5,
            background: "rgba(201,169,110,0.4)",
            display: "flex",
          }} />
          <span style={{
            fontSize: 13,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "rgba(201,169,110,0.6)",
            display: "flex",
          }}>
            1M2F Gallery
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
