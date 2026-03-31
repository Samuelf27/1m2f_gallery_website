"use client"

import { useEffect, useState } from "react"
import { getArtworks, deleteArtwork } from "@/services/api"
import type { Artwork } from "@/types/artwork.types"
import { useRouter } from "next/navigation"

export default function AdminArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    getArtworks()
      .then(setArtworks)
      .catch(() => setError("Não foi possível carregar as obras."))
  }, [])

  async function handleDelete(id: number, title: string) {
    const confirm = window.confirm(`Deseja remover "${title}"?`)
    if (!confirm) return

    try {
      await deleteArtwork(id)
      setArtworks((prev) => prev.filter((art) => art.id !== id))
    } catch {
      setError("Erro ao deletar obra. Tente novamente.")
    }
  }

  return (
    <div className="adminPage">
      <div className="adminPageHeader">
        <h1>Obras</h1>
        <a href="/admin/artworks/new" className="adminButton">+ Nova Obra</a>
      </div>

      {error && <p className="errorMessage">{error}</p>}

      <div className="adminList">
        {artworks.map((art) => (
          <div key={art.id} className="adminCard">
            <img src={art.image_url} alt={art.title} />

            <div className="adminCardInfo">
              <h3>{art.title}</h3>
              <p>{art.artist}</p>
              <span>{art.category} · {art.year}</span>
            </div>

            <div className="adminCardActions">
              <a
                href={`/admin/artworks/${art.id}`}
                className="editButton"
              >
                Editar
              </a>
              <button
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
