"use client"

import { useEffect, useState } from "react"
import { getTestimonial } from "@/services/api"
import { updateTestimonialAction } from "@/app/admin/actions"
import AdminBreadcrumb from "@/app/admin/_components/AdminBreadcrumb"
import type { Testimonial } from "@/types/testimonial.types"
import Link from "next/link"

const ROLES = ["Cliente", "Colecionador", "Crítico", "Curador", "Imprensa", "Outro"]

export default function EditDepoimento({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const [form, setForm] = useState({
    name: "",
    text: "",
    city: "",
    role: "",
    visible: true,
  })

  useEffect(() => {
    params.then(({ id }) => {
      setId(id)
      getTestimonial(id)
        .then((t: Testimonial) => {
          setForm({
            name: t.name,
            text: t.text,
            city: t.city ?? "",
            role: t.role ?? "",
            visible: t.visible,
          })
        })
        .catch(() => setError("Não foi possível carregar o depoimento."))
        .finally(() => setFetching(false))
    })
  }, [params])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target
    setForm({
      ...form,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    })
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!id) return
    setError(null)

    if (!form.name || !form.text) {
      setError("Nome e texto são obrigatórios.")
      return
    }

    setLoading(true)
    const result = await updateTestimonialAction(Number(id), form)

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
          <AdminBreadcrumb crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Depoimentos", href: "/admin/depoimentos" }, { label: "Editar" }]} />
          <h1>Editar Depoimento</h1>
        </div>
      </div>

      {error && <p className="adminError">{error}</p>}

      <form onSubmit={handleSubmit} className="adminForm">
        <div className="adminFormGrid">
          <div className="adminFormGroup adminFormGroup--full">
            <label className="adminLabel">Nome *</label>
            <input name="name" value={form.name} onChange={handleChange} autoFocus />
          </div>

          <div className="adminFormGroup">
            <label className="adminLabel">Papel</label>
            <select name="role" value={form.role} onChange={handleChange} className="adminSelect">
              <option value="">Selecionar...</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="adminFormGroup">
            <label className="adminLabel">Cidade</label>
            <input name="city" value={form.city} onChange={handleChange} />
          </div>

          <div className="adminFormGroup adminFormGroup--full">
            <label className="adminLabel">Depoimento *</label>
            <textarea name="text" value={form.text} onChange={handleChange} rows={5} />
          </div>

          <div className="adminFormGroup adminFormGroup--full">
            <label className="adminToggle">
              <input
                type="checkbox"
                name="visible"
                checked={form.visible}
                onChange={handleChange}
              />
              <span className="adminToggleTrack" />
              <span className="adminToggleLabel">Exibir no site</span>
            </label>
          </div>
        </div>

        <div className="adminFormActions">
          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
          <Link href="/admin/depoimentos">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}