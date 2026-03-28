import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "1M2F Gallery | Arte Contemporânea",
  description: "Galeria de arte contemporânea digital",
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

        <footer className="footer">
          <p>© 2026 1M2F Gallery. Todos os direitos reservados.</p>
        </footer>
      </body>
    </html>
  )
}
