"use client"

import { useState } from "react"
import { deleteTestimonialAction } from "@/app/admin/actions"

export function DeleteTestimonialButton({ id, name }: { id: number; name: string }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setLoading(true)
    const result = await deleteTestimonialAction(id)
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
        <span className="adminConfirmLabel">Remover depoimento de &ldquo;{name}&rdquo;?</span>
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