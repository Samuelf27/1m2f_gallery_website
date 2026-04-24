import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { FavoritesProvider } from "@/context/FavoritesContext"
import PageTransitionWrapper from "@/components/PageTransitionWrapper"
import ScrollToTop from "@/components/ScrollToTop"
import NavigationProgress from "@/components/NavigationProgress"
import CookieBanner from "@/components/CookieBanner"
import WhatsAppFloat from "@/components/WhatsAppFloat"
import ScrollAnimations from "@/components/ScrollAnimations"
import { Analytics } from "@vercel/analytics/next"
import { SITE_URL } from "@/lib/config"
import { getSettings } from "@/services/api"

const defaultOg = `${SITE_URL}/api/og?title=1M2F+Gallery&description=A+galeria+de+Maria+Fran%C3%A7a+%E2%80%94+mais+de+6.000+obras+em+acr%C3%ADlico%2C+tela%2C+porcelana+e+a%C3%A7o.+S%C3%A3o+Paulo%2C+Brasil&label=Arte+Contempor%C3%A2nea`

export const metadata: Metadata = {
  metadataBase:  new URL(SITE_URL),
  title: {
    default:  "1M2F Gallery | Maria França — Arte Contemporânea",
    template: "%s | 1M2F Gallery",
  },
  description: "Galeria de Maria França — mais de 6.000 obras originais em acrílico sobre tela, porcelana pintada à mão, papel e aço. Conheça a coleção e adquira a sua obra.",
  keywords: [
    "Maria França", "arte contemporânea", "galeria de arte", "São Paulo",
    "pintura brasileira", "acrílico sobre tela", "1M2F Gallery", "obras de arte",
    "porcelana pintada", "arte para comprar", "galeria online São Paulo",
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
    description: "Mais de 6.000 obras originais de Maria França — acrílico, tela, porcelana e aço. São Paulo, Brasil.",
    images: [{ url: defaultOg, width: 1200, height: 630, alt: "1M2F Gallery — Maria França" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "1M2F Gallery | Maria França — Arte Contemporânea",
    description: "Mais de 6.000 obras originais de Maria França — São Paulo, Brasil.",
    images:      [defaultOg],
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()

  return (
    <html lang="pt-BR">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <FavoritesProvider>
          <NavigationProgress />
          <Navbar />
          <PageTransitionWrapper>
            {children}
          </PageTransitionWrapper>
          <Footer
            whatsapp={settings.whatsapp}
            instagram={settings.instagram}
            facebook={settings.facebook}
          />
          <ScrollToTop />
          <CookieBanner />
          <WhatsAppFloat phone={settings.whatsapp} />
          <ScrollAnimations />
          <Analytics />
        </FavoritesProvider>
      </body>
    </html>
  )
}
