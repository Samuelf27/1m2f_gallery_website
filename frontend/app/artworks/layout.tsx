import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Coleção",
  description: "Explore a coleção completa de Maria França. Mais de 6.000 obras em acrílico, tela, porcelana e aço.",
  openGraph: {
    title: "Coleção — 1M2F Gallery",
    description: "Explore a coleção completa de Maria França. Mais de 6.000 obras em acrílico, tela, porcelana e aço.",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
  },
}

export default function ArtworksLayout({ children }: { children: React.ReactNode }) {
  return children
}
