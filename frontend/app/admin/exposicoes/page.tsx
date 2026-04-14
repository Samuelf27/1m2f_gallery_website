"use client"

import { useEffect, useState } from "react"
import { getExhibitions } from "@/services/api"
import { deleteExhibitionAction } from "@/app/admin/actions"
import type { Exhibition } from "@/types/exhibition.types"
import Link from "next/link"

const STATUS_LABELS: Record<string, string> = {
  proxima: "Próxima",
  em_cartaz: "Em cartaz",
  encerrada: "Encerrada",
  indefinida: "Sem data",
}

const STATUS_CLASS: Record<string, string> = {
  proxima: "adminBadge--gold",
  em_cartaz: "adminBadge--green",
  encerrada: "adminBadge--dim",
  indefinida: "adminBadge--dim",
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—"
  const [y, m, d] = dateStr.split("-")
  return `${d}/${m}/${y}`
}

export default function AdminExposicoes() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    getExhibitions()
      .then(setExhibitions)
      .catch(() => setError("Não foi possível carregar as exposições."))
  }, [])

  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`Deseja remover "${title}"?`)) return

    setDeletingId(id)
    const result = await deleteExhibitionAction(id)

    if ("error" in result) {
      setError(result.error)
    } else {
      setExhibitions((prev) => prev.filter((e) => e.id !== id))
    }
    setDeletingId(null)
  }

  return (
    <div className="adminPage">
      <div className="adminPageHeader">
        <div>
          <p className="adminPageLabel">Conteúdo</p>
          <h1>Exposições</h1>
        </div>
        <Link href="/admin/exposicoes/new" className="adminButton">
          + Nova Exposição
        </Link>
      </div>

      {error && <p className="adminError">{error}</p>}

      <div className="adminList">
        {exhibitions.length === 0 && !error && (
          <p className="adminEmpty">Nenhuma exposição cadastrada.</p>
        )}
        {exhibitions.map((ex) => (
          <div key={ex.id} className="adminCard">
            <div className="adminCardInfo">
              <h3>{ex.title}</h3>
              {ex.subtitle && <p>{ex.subtitle}</p>}
              <span>
                {ex.location ? `${ex.location} · ` : ""}
                {formatDate(ex.start_date)} — {formatDate(ex.end_date)}
              </span>
            </div>

            <div className="adminCardBadges">
              <span className={`adminBadge ${STATUS_CLASS[ex.status]}`}>
                {STATUS_LABELS[ex.status]}
              </span>
            </div>

            <div className="adminCardActions">
              <Link href={`/admin/exposicoes/${ex.id}`} className="editButton">
                Editar
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(ex.id, ex.title)}
                className="deleteButton"
                disabled={deletingId === ex.id}
              >
                {deletingId === ex.id ? "..." : "Deletar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}