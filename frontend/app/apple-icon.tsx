import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#080808",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        <div style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: 8,
          background: "#c9a96e",
          display: "flex",
        }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <span style={{ fontSize: 52, fontWeight: 400, color: "#f0ede8", letterSpacing: 4, display: "flex" }}>
            1M2F
          </span>
          <span style={{ fontSize: 14, letterSpacing: 6, color: "rgba(201,169,110,0.8)", textTransform: "uppercase", display: "flex" }}>
            Gallery
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
