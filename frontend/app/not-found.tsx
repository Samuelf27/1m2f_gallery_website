import Link from "next/link"

export default function NotFound() {
  return (
    <main className="errorPage">
      <div className="errorContent">
        <div className="errorCode">404</div>
        <h1 className="errorTitle">Página não encontrada</h1>
        <p className="errorSubtitle">A obra ou página que procura não existe ou foi removida.</p>
        <div className="errorActions">
          <Link href="/artworks" className="heroButton">Ver galeria →</Link>
          <Link href="/" className="errorLink">← Voltar ao início</Link>
        </div>
      </div>
    </main>
  )
}
