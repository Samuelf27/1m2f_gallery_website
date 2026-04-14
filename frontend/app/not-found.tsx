import Link from "next/link"

export default function NotFound() {
  return (
    <main className="notFoundPage">

      {/* Decorative number */}
      <div className="notFoundBg" aria-hidden="true">404</div>

      <div className="notFoundContent">
        <div className="aboutTag" style={{ marginBottom: "20px" }}>Página não encontrada</div>

        <h1 className="notFoundTitle">
          A obra que<br />procura não<br /><em>existe aqui</em>
        </h1>

        <blockquote className="notFoundQuote">
          "Perder-se às vezes é o início de uma nova descoberta."
          <cite>— Maria França</cite>
        </blockquote>

        <div className="notFoundActions">
          <Link href="/artworks" className="heroButton">Explorar a galeria →</Link>
          <Link href="/" className="notFoundHome">← Página inicial</Link>
        </div>

        <div className="notFoundLinks">
          <span>Ou visite:</span>
          <Link href="/exposicoes">Exposições</Link>
          <Link href="/about">Sobre a artista</Link>
          <Link href="/contact">Contato</Link>
          <Link href="/faq">FAQ</Link>
        </div>
      </div>

    </main>
  )
}
