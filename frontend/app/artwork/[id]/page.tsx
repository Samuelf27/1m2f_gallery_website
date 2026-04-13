import type { Metadata } from "next"
import { getArtwork } from "@/services/api"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { WHATSAPP_NUMBER } from "@/lib/config"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  try {
    const art = await getArtwork(id)
    return {
      title: `${art.title} — ${art.artist ?? "Maria França"}`,
      description: art.description ?? `Obra de ${art.artist ?? "Maria França"}${art.year ? `, ${art.year}` : ""}. Categoria: ${art.category}.`,
      openGraph: {
        title: art.title,
        description: art.description ?? `Obra de ${art.artist ?? "Maria França"}`,
        images: [{ url: art.image_url, alt: art.title }],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: art.title,
        description: art.description ?? `Obra de ${art.artist ?? "Maria França"}`,
        images: [art.image_url],
      },
    }
  } catch {
    return { title: "Obra não encontrada" }
  }
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let art
  try {
    art = await getArtwork(id)
  } catch {
    notFound()
  }

  const whatsappMsg = encodeURIComponent(
    `Olá! Tenho interesse em adquirir a obra "${art.title}"${art.artist ? ` de ${art.artist}` : ""}. Poderia me dar mais informações?`
  )
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`

  return (
    <main className="artPage">

      <div className="artLayout">

        {/* ── Imagem ─────────────────────────────────── */}
        <div className="artImageBlock">
          <div className="artImageWrapper">
            <Image
              src={art.image_url}
              alt={art.title}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          {/* Label "Obra única" */}
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

          {/* CTA principal */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="acquireBtn"
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

    </main>
  )
}
