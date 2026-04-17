import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#080808",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
        }}
      >
        {/* Faixa dourada à esquerda */}
        <div style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: 3,
          background: "#c9a96e",
          display: "flex",
        }} />
        <span style={{
          fontSize: 13,
          fontWeight: 400,
          color: "#f0ede8",
          letterSpacing: 1,
          display: "flex",
        }}>
          1M
        </span>
      </div>
    ),
    { ...size }
  )
}
