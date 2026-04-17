import type { Metadata } from "next"
import { SITE_URL } from "@/lib/config"

const ogImage = `${SITE_URL}/api/og?title=Contato&description=Adquira+uma+obra+de+Maria+Fran%C3%A7a+ou+agende+uma+visita+%E2%80%94+atendimento+pelo+WhatsApp+em+at%C3%A9+24h&label=Galeria+1M2F`

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com a Galeria 1M2F para adquirir obras de Maria França, tirar dúvidas ou agendar uma visita. Atendimento via WhatsApp em até 24 horas.",
  keywords: [
    "contato galeria arte São Paulo", "comprar arte Maria França",
    "WhatsApp galeria arte", "1M2F contato", "agendar visita galeria",
  ],
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title:       "Contato — 1M2F Gallery",
    description: "Adquira uma obra de Maria França ou agende uma visita. Atendimento pelo WhatsApp em até 24h.",
    url:          `${SITE_URL}/contact`,
    siteName:    "1M2F Gallery",
    locale:      "pt_BR",
    type:        "website",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Contato 1M2F Gallery" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Contato — 1M2F Gallery",
    description: "Atendimento pelo WhatsApp em até 24h.",
    images:      [ogImage],
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
