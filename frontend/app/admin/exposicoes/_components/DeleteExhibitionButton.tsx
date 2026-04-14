"use client"

import { useState } from "react"
import { deleteExhibitionAction } from "@/app/admin/actions"

export function DeleteExhibitionButton({ id, title }: { id: number; title: string }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setLoading(true)
    const result = await deleteExhibitionAction(id)
    if ("error" in result) {
      setError(result.error)
      setLoading(false)
      setConfirming(false)
    }
  }

  if (error) return <span className="adminInlineError">{error}</span>

  if (confirming) {
    return (
      <span className="adminConfirm">
        <span className="adminConfirmLabel">Remover?</span>
        <button type="button" className="deleteButton" onClick={handleDelete} disabled={loading}>
          {loading ? "..." : "Sim"}
        </button>
        <button type="button" className="editButton" onClick={() => setConfirming(false)}>
          Não
        </button>
      </span>
    )
  }

  return (
    <button type="button" className="deleteButton" onClick={() => setConfirming(true)}>
      Deletar
    </button>
  )
}