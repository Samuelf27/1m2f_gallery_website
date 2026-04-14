"use client"

import { useEffect, useState } from "react"
import { getExhibition } from "@/services/api"
import { updateExhibitionAction } from "@/app/admin/actions"
import type { Exhibition } from "@/types/exhibition.types"
import Link from "next/link"

export default function EditExposicao({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    start_date: "",
    end_date: "",
    location: "",
    description: "",
  })

  useEffect(() => {
    params.then(({ id }) => {
      setId(id)
      getExhibition(id)
        .then((ex: Exhibition) => {
          setForm({
            title: ex.title,
            subtitle: ex.subtitle ?? "",
            start_date: ex.start_date ?? "",
            end_date: ex.end_date ?? "",
            location: ex.location ?? "",
            description: ex.description ?? "",
          })
        })
        .catch(() => setError("Não foi possível carregar a exposição."))
        .finally(() => setFetching(false))
    })
  }, [params])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!id) return
    setError(null)

    if (!form.title) {
      setError("Título é obrigatório.")
      return
    }

    setLoading(true)
    const result = await updateExhibitionAction(Number(id), form)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  if (fetching) return <div className="adminLoading">Carregando...</div>

  return (
    <div className="adminPage">
      <div className="adminPageHeader">
        <div>
          <p className="adminPageLabel">
            <Link href="/admin/exposicoes">← Exposições</Link>
          </p>
          <h1>Editar Exposição</h1>
        </div>
      </div>

      {error && <p className="adminError">{error}</p>}

      <form onSubmit={handleSubmit} className="adminForm">
        <div className="adminFormGrid">
          <div className="adminFormGroup adminFormGroup--full">
            <label className="adminLabel">Título *</label>
            <input name="title" value={form.title} onChange={handleChange} autoFocus />
          </div>

          <div className="adminFormGroup adminFormGroup--full">
            <label className="adminLabel">Subtítulo</label>
            <input name="subtitle" value={form.subtitle} onChange={handleChange} />
          </div>

          <div className="adminFormGroup">
            <label className="adminLabel">Data de Início</label>
            <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="adminDateInput" />
          </div>

          <div className="adminFormGroup">
            <label className="adminLabel">Data de Término</label>
            <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className="adminDateInput" />
          </div>

          <div className="adminFormGroup adminFormGroup--full">
            <label className="adminLabel">Localização</label>
            <input name="location" value={form.location} onChange={handleChange} />
          </div>

          <div className="adminFormGroup adminFormGroup--full">
            <label className="adminLabel">Descrição</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
          </div>
        </div>

        <div className="adminFormActions">
          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
          <Link href="/admin/exposicoes">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}