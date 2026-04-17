import type { Metadata } from "next"
import { SITE_URL } from "@/lib/config"

const ogImage = `${SITE_URL}/api/og?title=Exposi%C3%A7%C3%B5es&description=Agenda+de+exposi%C3%A7%C3%B5es+de+Maria+Fran%C3%A7a+%E2%80%94+mostra+o+calend%C3%A1rio+completo+de+exposi%C3%A7%C3%B5es+passadas%2C+em+cartaz+e+pr%C3%B3ximas&label=Galeria+1M2F`

export const metadata: Metadata = {
  title: "Exposições",
  description: "Agenda completa de exposições de Maria França — acompanhe as mostras em cartaz, próximas e passadas da Galeria 1M2F em São Paulo e no mundo.",
  keywords: [
    "exposições Maria França", "agenda de arte São Paulo", "mostra de arte",
    "galeria 1M2F exposições", "arte contemporânea Brasil", "calendário exposições",
  ],
  alternates: { canonical: `${SITE_URL}/exposicoes` },
  openGraph: {
    title:       "Exposições — 1M2F Gallery",
    description: "Agenda completa de exposições de Maria França — mostras em cartaz, próximas e passadas.",
    url:          `${SITE_URL}/exposicoes`,
    siteName:    "1M2F Gallery",
    locale:      "pt_BR",
    type:        "website",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Exposições 1M2F Gallery" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Exposições — 1M2F Gallery",
    description: "Agenda completa de exposições de Maria França.",
    images:      [ogImage],
  },
}

export default function ExposicoesLayout({ children }: { children: React.ReactNode }) {
  return children
}
