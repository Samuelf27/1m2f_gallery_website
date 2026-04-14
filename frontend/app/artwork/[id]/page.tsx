import type { Metadata } from "next"
import { getArtwork, getArtworks } from "@/services/api"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { WHATSAPP_NUMBER, SITE_URL } from "@/lib/config"

/* ─── METADATA DINÂMICO ────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  try {
    const art = await getArtwork(id)
    const artist = art.artist ?? "Maria França"
    const title  = `${art.title} — ${artist}`

    const description = art.description
      ? art.description.length > 155
        ? `${art.description.slice(0, 152).trimEnd()}…`
        : art.description
      : `Obra "${art.title}" de ${artist}${art.year ? `, ${art.year}` : ""}. ${art.category ? `Categoria: ${art.category}.` : ""} Galeria 1M2F — São Paulo, Brasil.`

    const keywords = [
      art.title,
      artist,
      art.category,
      art.year,
      "arte contemporânea",
      "galeria de arte",
      "São Paulo",
      "1M2F Gallery",
      "obra original",
      "pintura brasileira",
    ].filter(Boolean) as string[]

    const pageUrl = `${SITE_URL}/artwork/${id}`

    return {
      title,
      description,
      keywords,
      alternates: { canonical: pageUrl },
      openGraph: {
        title:       `${art.title} — 1M2F Gallery`,
        description,
        url:         pageUrl,
        siteName:    "1M2F Gallery",
        locale:      "pt_BR",
        type:        "article",
        images: [{
          url:    art.image_url,
          alt:    `${art.title} — ${artist}`,
          width:  1200,
          height: 800,
        }],
      },
      twitter: {
        card:        "summary_large_image",
        title:       `${art.title} — 1M2F Gallery`,
        description,
        images:      [art.image_url],
      },
    }
  } catch {
    return { title: "Obra não encontrada" }
  }
}

/* ─── PÁGINA ───────────────────────────────────────────────── */
export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let art
  let related: Awaited<ReturnType<typeof getArtworks>> = []
  try {
    const [artData, all] = await Promise.all([getArtwork(id), getArtworks()])
    art = artData
    related = all
      .filter((a) => a.id !== artData.id && a.category === artData.category)
      .slice(0, 4)
  } catch {
    notFound()
  }

  const artist      = art.artist ?? "Maria França"
  const pageUrl     = `${SITE_URL}/artwork/${id}`
  const whatsappMsg = encodeURIComponent(
    `Olá! Tenho interesse em adquirir a obra "${art.title}"${art.artist ? ` de ${art.artist}` : ""}. Poderia me dar mais informações?`
  )
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`

  /* JSON-LD — VisualArtwork schema */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name:        art.title,
    url:         pageUrl,
    image:       art.image_url,
    description: art.description ?? undefined,
    dateCreated: art.year        ?? undefined,
    artMedium:   art.category    ?? undefined,
    creator: {
      "@type":      "Person",
      name:          artist,
      nationality:   "Brazilian",
      url:           `${SITE_URL}/about`,
    },
    isPartOf: {
      "@type": "ArtGallery",
      name:    "1M2F Gallery",
      url:      SITE_URL,
      address: {
        "@type":           "PostalAddress",
        addressLocality:   "São Paulo",
        addressCountry:    "BR",
      },
    },
    offers: {
      "@type":        "Offer",
      availability:   "https://schema.org/InStock",
      areaServed:     "BR",
      seller: {
        "@type": "Person",
        name:     artist,
      },
    },
  }

  return (
    <main className="artPage">

      {/* JSON-LD injetado no head via script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="artLayout">

        {/* ── Imagem ─────────────────────────────────── */}
        <div className="artImageBlock">
          <div className="artImageWrapper">
            <Image
              src={art.image_url}
              alt={`${art.title} — ${artist}`}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              style={{ objectFit: "cover" }}
              priority
              quality={90}
            />
          </div>
          <div className="artImageLabel">Obra única</div>
        </div>

        {/* ── Info ───────────────────────────────────── */}
        <div className="artInfoBlock">

          <Link href="/artworks" className="backLink">← Galeria</Link>

          {art.category && (
            <div className="artCategory">{art.category}</div>
          )}

          <h1 className="artTitle">{art.title}</h1>

          {art.artist && (
            <p className="artArtist">{art.artist}</p>
          )}

          {art.year && (
            <div className="artMetaRow">
              <div className="artMetaItem">
                <span className="artMetaLabel">Ano</span>
                <span className="artMetaValue">{art.year}</span>
              </div>
              <div className="artMetaItem">
                <span className="artMetaLabel">Origem</span>
                <span className="artMetaValue">São Paulo, Brasil</span>
              </div>
              <div className="artMetaItem">
                <span className="artMetaLabel">Disponibilidade</span>
                <span className="artMetaValue artMetaAvailable">Disponível</span>
              </div>
            </div>
          )}

          {art.description && (
            <p className="artDescription">{art.description}</p>
          )}

          <div className="artDivider" />

          {/* Trust strip */}
          <div className="artTrustStrip">
            <div className="artTrustItem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Obra original certificada
            </div>
            <div className="artTrustItem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Resposta em até 24h
            </div>
            <div className="artTrustItem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Atendimento personalizado
            </div>
          </div>

          {/* CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="acquireBtn"
            aria-label={`Adquirir a obra "${art.title}" via WhatsApp`}
          >
            <span className="acquireBtnBg" />
            <span className="acquireBtnText">Adquirir esta Obra</span>
            <span className="acquireBtnIcon">→</span>
          </a>

          <p className="artContactNote">
            Via WhatsApp · Pagamento e envio combinados diretamente com a artista
          </p>

        </div>
      </div>

      {/* ── Obras relacionadas ─────────────────────────── */}
      {related.length > 0 && (
        <section className="relatedSection">
          <div className="relatedHeader">
            <h2 className="relatedTitle">Obras relacionadas</h2>
            <Link href={`/artworks?categoria=${encodeURIComponent(art.category ?? "")}`} className="relatedSeeAll">
              Ver mais →
            </Link>
          </div>
          <div className="relatedGrid">
            {related.map((r) => (
              <Link key={r.id} href={`/artwork/${r.id}`} className="relatedCard">
                <div className="relatedCardImage">
                  <Image
                    src={r.image_url}
                    alt={r.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="relatedCardOverlay">
                    <span>{r.title}</span>
                  </div>
                </div>
                <p className="relatedCardLabel">{r.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  )
}
