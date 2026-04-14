import type { CSSProperties } from "react"
import Link from "next/link"

type PressItem = {
  id:          number
  outlet:      string
  title:       string
  excerpt:     string
  date:        string
  category:    "revista" | "jornal" | "digital" | "tv"
  link?:       string
}

const PRESS_ITEMS: PressItem[] = [
  {
    id: 1,
    outlet:   "Folha de S.Paulo",
    title:    "Maria França e a arte que atravessa fronteiras",
    excerpt:  "Em entrevista exclusiva, a artista fala sobre suas vivências em quatro continentes e como elas moldaram sua visão sobre cor, matéria e identidade brasileira.",
    date:     "2024-10-12",
    category: "jornal",
  },
  {
    id: 2,
    outlet:   "Revista Piauí",
    title:    "O ateliê como laboratório do mundo",
    excerpt:  "Reportagem especial sobre o processo criativo de Maria França, que transforma experiências de viagem em obras de acervo permanente de museus nacionais.",
    date:     "2024-08-05",
    category: "revista",
  },
  {
    id: 3,
    outlet:   "Arte!Brasileiros",
    title:    "Matéria e Sentimento: uma exposição que emociona",
    excerpt:  "Crítica da exposição no Centro Cultural São Paulo, destacando a capacidade da artista de criar diálogo entre suportes tão distintos quanto aço e porcelana.",
    date:     "2024-09-28",
    category: "digital",
  },
  {
    id: 4,
    outlet:   "Cultura.SP",
    title:    "Top 10 exposições do segundo semestre em SP",
    excerpt:  '"Matéria e Sentimento" figura entre as mostras imperdíveis do segundo semestre, com destaque para a instalação central em aço inoxidável.',
    date:     "2024-07-15",
    category: "digital",
  },
  {
    id: 5,
    outlet:   "Estadão",
    title:    "Galeria 1M2F apresenta nova coleção de porcelanas",
    excerpt:  "A artista Maria França revela série inédita de porcelanas pintadas à mão inspiradas em padrões têxteis de comunidades andinas e da África subsaariana.",
    date:     "2023-11-20",
    category: "jornal",
  },
  {
    id: 6,
    outlet:   "GNT Decora",
    title:    "Arte contemporânea como protagonista do lar",
    excerpt:  "Especial de decoração apresenta obras da galeria 1M2F como peças-chave em projetos residenciais de alto padrão assinados por arquitetos brasileiros.",
    date:     "2023-09-08",
    category: "tv",
  },
]

const MONTHS_PT = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
]

function formatDate(str: string) {
  const [year, month, day] = str.split("-").map(Number)
  return `${day} ${MONTHS_PT[month - 1]}. ${year}`
}

const CATEGORY_LABELS: Record<PressItem["category"], string> = {
  revista: "Revista",
  jornal:  "Jornal",
  digital: "Digital",
  tv:      "TV / Vídeo",
}

export default function ImprensaPage() {
  return (
    <main className="page pressPage">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="pageHeader">
        <div>
          <div className="aboutTag" style={{ marginBottom: "16px" }}>Mídia & Imprensa</div>
          <h1 className="title" style={{ marginBottom: "8px" }}>Na Imprensa</h1>
          <p className="pageSubtitle">Cobertura e menções em veículos nacionais</p>
        </div>
        <a href="mailto:imprensa@1m2fgallery.com" className="heroButton">
          Solicitar press kit →
        </a>
      </div>

      {/* ── Lista ───────────────────────────────────────── */}
      <div className="pressList">
        {PRESS_ITEMS.map((item, i) => (
          <article
            key={item.id}
            className="pressCard"
            style={{ "--delay": `${i * 60}ms` } as CSSProperties}
          >
            <div className="pressCardMeta">
              <span className="pressCategoryBadge">{CATEGORY_LABELS[item.category]}</span>
              <time className="pressDate">{formatDate(item.date)}</time>
            </div>
            <div className="pressCardBody">
              <p className="pressOutlet">{item.outlet}</p>
              <h2 className="pressTitle">{item.title}</h2>
              <p className="pressExcerpt">{item.excerpt}</p>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressLink"
                >
                  Ler matéria completa →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* ── Press Kit CTA ───────────────────────────────── */}
      <section className="exhCta">
        <div>
          <h2>Cobertura jornalística?</h2>
          <p>Disponibilizamos press kit completo com imagens em alta resolução, biografia e texto curatorial para veículos de comunicação.</p>
        </div>
        <Link href="/contact" className="heroButton">Entrar em contato →</Link>
      </section>

    </main>
  )
}
