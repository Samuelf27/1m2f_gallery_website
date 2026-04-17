import type { Metadata } from "next"
import { SITE_URL } from "@/lib/config"

export const metadata: Metadata = {
  title: "Coleção",
  description: "Explore a coleção completa de Maria França — mais de 6.000 obras em acrílico sobre tela, porcelana, papel e aço. Galeria 1M2F, São Paulo.",
  keywords: [
    "coleção de arte", "Maria França", "galeria de arte São Paulo",
    "obras de arte para comprar", "arte contemporânea brasileira",
    "acrílico sobre tela", "1M2F Gallery",
  ],
  alternates: { canonical: `${SITE_URL}/artworks` },
  openGraph: {
    title:       "Coleção — 1M2F Gallery",
    description: "Explore a coleção completa de Maria França — mais de 6.000 obras em acrílico sobre tela, porcelana, papel e aço.",
    url:          `${SITE_URL}/artworks`,
    siteName:    "1M2F Gallery",
    locale:      "pt_BR",
    type:        "website",
    images: [{ url: `${SITE_URL}/api/og?title=Cole%C3%A7%C3%A3o&description=Mais+de+6.000+obras+originais+de+Maria+Fran%C3%A7a+%E2%80%94+acr%C3%ADlico%2C+tela%2C+porcelana+e+a%C3%A7o&label=Galeria+1M2F`, width: 1200, height: 630, alt: "Coleção 1M2F Gallery" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Coleção — 1M2F Gallery",
    description: "Mais de 6.000 obras de Maria França disponíveis.",
    images:      [`${SITE_URL}/api/og?title=Cole%C3%A7%C3%A3o&description=Mais+de+6.000+obras+originais+de+Maria+Fran%C3%A7a&label=Galeria+1M2F`],
  },
}

export default function ArtworksLayout({ children }: { children: React.ReactNode }) {
  return children
}
