import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const siteUrl = "https://1m2f-gallery.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "1M2F Gallery | Maria França — Arte Contemporânea",
    template: "%s | 1M2F Gallery",
  },
  description: "Galeria de Maria França. Mais de 6.000 obras em acrílico sobre tela, papel, porcelana e aço. São Paulo, Brasil.",
  keywords: ["Maria França", "arte contemporânea", "galeria de arte", "São Paulo", "pintura", "acrílico", "1M2F"],
  authors: [{ name: "Maria França" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "1M2F Gallery",
    title: "1M2F Gallery | Maria França — Arte Contemporânea",
    description: "Galeria de Maria França. Mais de 6.000 obras em acrílico sobre tela, papel, porcelana e aço. São Paulo, Brasil.",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630, alt: "1M2F Gallery — Maria França" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "1M2F Gallery | Maria França — Arte Contemporânea",
    description: "Galeria de Maria França. Mais de 6.000 obras em acrílico sobre tela, papel, porcelana e aço. São Paulo, Brasil.",
    images: ["/images/og-default.jpg"],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
