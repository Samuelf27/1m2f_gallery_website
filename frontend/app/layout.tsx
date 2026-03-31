import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "1M2F Gallery | Maria França — Arte Contemporânea",
  description: "Galeria de Maria França. Mais de 6.000 obras em acrílico sobre tela, papel, porcelana e aço. São Paulo, Brasil.",
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
      </body>
    </html>
  )
}
