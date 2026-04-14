"use client"

import { useState } from "react"
import { createExhibitionAction } from "@/app/admin/actions"
import Link from "next/link"

export default function NewExposicao() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    start_date: "",
    end_date: "",
    location: "",
    description: "",
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError(null)

    if (!form.title) {
      setError("Título é obrigatório.")
      return
    }

    setLoading(true)
    const result = await createExhibitionAction(form)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="adminPage">
      <div className="adminPageHeader">
        <div>
          <p className="adminPageLabel">
            <Link href="/admin/exposicoes">← Exposições</Link>
          </p>
          <h1>Nova Exposição</h1>
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
            {loading ? "Criando..." : "Criar exposição"}
          </button>
          <Link href="/admin/exposicoes">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}
