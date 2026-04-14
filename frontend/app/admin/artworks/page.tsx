import { getArtworks } from "@/services/api"
import type { Artwork } from "@/types/artwork.types"
import Link from "next/link"
import Image from "next/image"
import { DeleteArtworkButton } from "./_components/DeleteArtworkButton"

export default async function AdminArtworks() {
  let artworks: Artwork[] = []
  let fetchError = false

  try {
    artworks = await getArtworks()
  } catch {
    fetchError = true
  }

  return (
    <div className="adminPage">
      <div className="adminPageHeader">
        <div>
          <p className="adminPageLabel">Conteúdo</p>
          <h1>Obras</h1>
        </div>
        <Link href="/admin/artworks/new" className="adminButton">
          + Nova Obra
        </Link>
      </div>

      {fetchError && (
        <p className="adminError">Não foi possível carregar as obras.</p>
      )}

      <div className="adminList">
        {artworks.length === 0 && !fetchError && (
          <p className="adminEmpty">Nenhuma obra cadastrada.</p>
        )}
        {artworks.map((art) => (
          <div key={art.id} className="adminCard">
            <div className="adminCardImage">
              <Image
                src={art.image_url}
                alt={art.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="80px"
              />
            </div>

            <div className="adminCardInfo">
              <h3>{art.title}</h3>
              <p>{art.artist}</p>
              <span>{art.category}{art.year ? ` · ${art.year}` : ""}</span>
            </div>

            <div className="adminCardBadges">
              {art.featured && (
                <span className="adminBadge adminBadge--gold">Destaque</span>
              )}
              <span className={`adminBadge ${art.available === "vendido" ? "adminBadge--red" : "adminBadge--green"}`}>
                {art.available || "disponível"}
              </span>
            </div>

            <div className="adminCardActions">
              <Link href={`/admin/artworks/${art.id}`} className="editButton">
                Editar
              </Link>
              <DeleteArtworkButton id={art.id} title={art.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}