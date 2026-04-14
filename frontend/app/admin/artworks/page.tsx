"use client"

import { useEffect, useState } from "react"
import { getArtworks } from "@/services/api"
import { deleteArtworkAction } from "@/app/admin/actions"
import type { Artwork } from "@/types/artwork.types"
import Link from "next/link"
import Image from "next/image"

export default function AdminArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    getArtworks()
      .then(setArtworks)
      .catch(() => setError("Não foi possível carregar as obras."))
  }, [])

  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`Deseja remover "${title}"?`)) return

    setDeletingId(id)
    const result = await deleteArtworkAction(id)

    if ("error" in result) {
      setError(result.error)
    } else {
      setArtworks((prev) => prev.filter((art) => art.id !== id))
    }
    setDeletingId(null)
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

      {error && <p className="adminError">{error}</p>}

      <div className="adminList">
        {artworks.length === 0 && !error && (
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
              <button
                type="button"
                onClick={() => handleDelete(art.id, art.title)}
                className="deleteButton"
                disabled={deletingId === art.id}
              >
                {deletingId === art.id ? "..." : "Deletar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}