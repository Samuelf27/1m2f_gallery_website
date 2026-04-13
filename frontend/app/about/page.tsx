import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sobre Maria França",
  description: "Conheça Maria França, artista brasileira com mais de 6.000 obras e vivências em quatro continentes.",
  openGraph: {
    title: "Sobre Maria França — 1M2F Gallery",
    description: "Conheça Maria França, artista brasileira com mais de 6.000 obras e vivências em quatro continentes.",
    images: [{ url: "/images/maria-franca.jpeg", alt: "Maria França" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre Maria França — 1M2F Gallery",
    description: "Conheça Maria França, artista brasileira com mais de 6.000 obras e vivências em quatro continentes.",
    images: ["/images/maria-franca.jpeg"],
  },
}

const stats = [
  { value: "6.000+", label: "Obras criadas" },
  { value: "4", label: "Continentes" },
  { value: "30+", label: "Anos de arte" },
]

const blocks = [
  {
    label: "A missão",
    title: "Criar o que nunca foi criado",
    text: 'Criar arte inesquecível e fascinante, que ninguém fez antes. Criar atmosferas únicas contra o "vazio". Dar espaço mágico para ambientes mais acolhedores e expressivos.',
  },
  {
    label: "A obra",
    title: "Mais de 6.000 criações",
    text: "Acrílico ou óleo sobre tela, papel, madeira, têxteis, porcelana e aço. Usa pincéis, espátula, palitos e dedos para resultados únicos e marcantes. Escolher cores harmoniosas é uma habilidade especial de Maria.",
  },
  {
    label: "O que é arte",
    title: "Arte é existência",
    text: "Para Maria França, arte é perder-se ou encontrar-se em seus próprios pensamentos e expressar sentimentos ao mundo. É criar, compartilhar a existência e respeitar o Outro com suas diferenças. A ARTE é uma companheira da VIDA.",
  },
]

export default function AboutPage() {
  return (
    <main className="aboutPage">

      {/* ── Hero ───────────────────────────────────── */}
      <section className="aboutHero">
        <div className="aboutHeroText">
          <div className="aboutTag">A artista</div>
          <h1 className="aboutTitle">
            Maria<br /><em>França</em>
          </h1>
          <p className="aboutBio">
            Brasileira, nascida em 1969, São Paulo. Vivências nos EUA, América do Sul, Ásia, Caribe, Arábia Saudita e Europa que, quando refletidas, moldam sua obra e suas criações. Com formação em história, TI e turismo, é uma pessoa multiprofissional e multifuncional.
          </p>
          <Link href="/contact" className="heroButton" style={{ marginTop: "16px" }}>
            Entrar em contato →
          </Link>
        </div>

        <div className="aboutHeroImage">
          <Image
            src="/images/maria-franca.jpeg"
            alt="Maria França"
            fill
            sizes="50vw"
            style={{ objectFit: "cover", filter: "grayscale(12%)" }}
            priority
          />
        </div>
      </section>

      {/* ── Números ────────────────────────────────── */}
      <section className="aboutStats">
        {stats.map((s) => (
          <div key={s.label} className="aboutStat">
            <div className="aboutStatValue">{s.value}</div>
            <div className="aboutStatLabel">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── Blocos ─────────────────────────────────── */}
      <section className="aboutContent">
        {blocks.map((b) => (
          <div key={b.label} className="aboutBlock">
            <div className="aboutBlockLabel">{b.label}</div>
            <h3>{b.title}</h3>
            <p>{b.text}</p>
          </div>
        ))}
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <section className="aboutCta">
        <h2>Quer uma obra <em>única</em> para o seu espaço?</h2>
        <Link href="/contact" className="heroButton">Fale com a artista →</Link>
      </section>

    </main>
  )
}