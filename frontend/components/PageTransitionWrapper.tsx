"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

/**
 * Reaplica a animação de entrada a cada navegação.
 * Funciona como fallback nos browsers que não suportam
 * View Transitions API (a chave `key={pathname}` força
 * o React a remontar o componente e re-disparar a animação CSS).
 */
export default function PageTransitionWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return (
    <div key={pathname} className="pageTransitionWrapper">
      {children}
    </div>
  )
}
