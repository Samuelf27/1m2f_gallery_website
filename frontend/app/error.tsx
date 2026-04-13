"use client"

import Link from "next/link"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="errorPage">
      <div className="errorContent">
        <div className="errorCode">500</div>
        <h1 className="errorTitle">Algo correu mal</h1>
        <p className="errorSubtitle">Ocorreu um erro inesperado. Tente novamente ou volte à galeria.</p>
        <div className="errorActions">
          <button type="button" className="heroButton" onClick={reset}>
            Tentar novamente
          </button>
          <Link href="/" className="errorLink">← Voltar ao início</Link>
        </div>
      </div>
    </main>
  )
}
