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

  useEffect(() => {
    getArtworks()
      .then(setArtworks)
      .catch(() => setError("Não foi possível carregar as obras."))
  }, [])

  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`Deseja remover "${title}"?`)) return

    const result = await deleteArtworkAction(id)

    if ("error" in result) {
      setError(result.error)
    } else {
      setArtworks((prev) => prev.filter((art) => art.id !== id))
    }
  }

  return (
    <div className="adminPage">
      <div className="adminPageHeader">
        <h1>Obras</h1>
        <Link href="/admin/artworks/new" className="adminButton">
          + Nova Obra
        </Link>
      </div>

      {error && <p className="errorMessage">{error}</p>}

      <div className="adminList">
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
              <span>{art.category} · {art.year}</span>
            </div>

            <div className="adminCardActions">
              <Link href={`/admin/artworks/${art.id}`} className="editButton">
                Editar
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(art.id, art.title)}
                className="deleteButton"
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}