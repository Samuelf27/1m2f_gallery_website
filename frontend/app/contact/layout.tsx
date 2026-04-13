import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com a galeria 1M2F para adquirir obras de Maria França ou agendar uma visita.",
  openGraph: {
    title: "Contato — 1M2F Gallery",
    description: "Entre em contato com a galeria 1M2F para adquirir obras de Maria França ou agendar uma visita.",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
