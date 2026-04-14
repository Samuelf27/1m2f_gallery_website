import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { FavoritesProvider } from "@/context/FavoritesContext"
import PageTransitionWrapper from "@/components/PageTransitionWrapper"
import { SITE_URL } from "@/lib/config"

export const metadata: Metadata = {
  metadataBase:  new URL(SITE_URL),
  title: {
    default:  "1M2F Gallery | Maria França — Arte Contemporânea",
    template: "%s | 1M2F Gallery",
  },
  description: "Galeria de Maria França. Mais de 6.000 obras em acrílico sobre tela, papel, porcelana e aço. São Paulo, Brasil.",
  keywords: [
    "Maria França", "arte contemporânea", "galeria de arte", "São Paulo",
    "pintura brasileira", "acrílico sobre tela", "1M2F Gallery", "obras de arte",
  ],
  authors:    [{ name: "Maria França", url: `${SITE_URL}/about` }],
  creator:    "Maria França",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type:        "website",
    locale:      "pt_BR",
    url:          SITE_URL,
    siteName:    "1M2F Gallery",
    title:       "1M2F Gallery | Maria França — Arte Contemporânea",
    description: "Galeria de Maria França. Mais de 6.000 obras em acrílico sobre tela, papel, porcelana e aço. São Paulo, Brasil.",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630, alt: "1M2F Gallery — Maria França" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "1M2F Gallery | Maria França — Arte Contemporânea",
    description: "Galeria de Maria França. Mais de 6.000 obras em acrílico sobre tela, papel, porcelana e aço. São Paulo, Brasil.",
    images:      ["/images/og-default.jpg"],
  },
  robots: { index: true, follow: true },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ArtGallery",
  name:    "1M2F Gallery",
  url:      SITE_URL,
  logo:    `${SITE_URL}/logo.png`,
  description: "Galeria de arte contemporânea de Maria França. Mais de 6.000 obras originais.",
  founder: {
    "@type":      "Person",
    name:          "Maria França",
    nationality:   "Brazilian",
    birthDate:    "1969",
    url:          `${SITE_URL}/about`,
  },
  address: {
    "@type":           "PostalAddress",
    addressLocality:   "São Paulo",
    addressRegion:     "SP",
    addressCountry:    "BR",
  },
  sameAs: [
    "https://www.instagram.com/1m2fgallery",
    "https://www.youtube.com/@1m2fgallery",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <FavoritesProvider>
          <Navbar />
          <PageTransitionWrapper>
            {children}
          </PageTransitionWrapper>
          <Footer />
        </FavoritesProvider>
      </body>
    </html>
  )
}
