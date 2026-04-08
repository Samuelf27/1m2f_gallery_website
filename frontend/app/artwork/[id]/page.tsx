import { getArtwork } from "@/services/api"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

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
  const whatsappUrl = `https://wa.me/5511999449449?text=${whatsappMsg}`

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
            </div>
          )}

          {art.description && (
            <p className="artDescription">{art.description}</p>
          )}

          <div className="artDivider" />

          {/* CTA principal */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="acquireBtn"
          >
            <span className="acquireBtnBg" />
            <span className="acquireBtnText">Adquirir Obra</span>
            <span className="acquireBtnIcon">→</span>
          </a>

          <p className="artContactNote">
            Resposta em até 24h · Atendimento personalizado
          </p>

        </div>
      </div>

    </main>
  )
}