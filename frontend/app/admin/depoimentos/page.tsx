"use client"

import { useEffect, useState } from "react"
import { getTestimonials } from "@/services/api"
import { deleteTestimonialAction } from "@/app/admin/actions"
import type { Testimonial } from "@/types/testimonial.types"
import Link from "next/link"

export default function AdminDepoimentos() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    getTestimonials()
      .then(setTestimonials)
      .catch(() => setError("Não foi possível carregar os depoimentos."))
  }, [])

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Deseja remover o depoimento de "${name}"?`)) return

    setDeletingId(id)
    const result = await deleteTestimonialAction(id)

    if ("error" in result) {
      setError(result.error)
    } else {
      setTestimonials((prev) => prev.filter((t) => t.id !== id))
    }
    setDeletingId(null)
  }

  return (
    <div className="adminPage">
      <div className="adminPageHeader">
        <div>
          <p className="adminPageLabel">Conteúdo</p>
          <h1>Depoimentos</h1>
        </div>
        <Link href="/admin/depoimentos/new" className="adminButton">
          + Novo Depoimento
        </Link>
      </div>

      {error && <p className="adminError">{error}</p>}

      <div className="adminList">
        {testimonials.length === 0 && !error && (
          <p className="adminEmpty">Nenhum depoimento cadastrado.</p>
        )}
        {testimonials.map((t) => (
          <div key={t.id} className="adminCard">
            <div className="adminCardInfo">
              <h3>{t.name}</h3>
              {t.role && <p>{t.role}{t.city ? ` · ${t.city}` : ""}</p>}
              <span className="adminCardExcerpt">
                &ldquo;{t.text.length > 120 ? t.text.slice(0, 120) + "..." : t.text}&rdquo;
              </span>
            </div>

            <div className="adminCardBadges">
              <span className={`adminBadge ${t.visible ? "adminBadge--green" : "adminBadge--dim"}`}>
                {t.visible ? "Visível" : "Oculto"}
              </span>
            </div>

            <div className="adminCardActions">
              <Link href={`/admin/depoimentos/${t.id}`} className="editButton">
                Editar
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(t.id, t.name)}
                className="deleteButton"
                disabled={deletingId === t.id}
              >
                {deletingId === t.id ? "..." : "Deletar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}