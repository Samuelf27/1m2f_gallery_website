"use client"

import { useState } from "react"
import { createArtworkAction } from "@/app/admin/actions"
import Link from "next/link"
import AdminBreadcrumb from "@/app/admin/_components/AdminBreadcrumb"
import Image from "next/image"

const CATEGORIES = ["Pintura", "Escultura", "Fotografia", "Gravura", "Desenho", "Mista", "Digital", "Outra"]

export default function NewArtwork() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: "",
    artist: "",
    year: "",
    description: "",
    image_url: "",
    category: "",
    dimensions: "",
    available: "disponível",
    featured: false,
  })

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
    setError(null)

    if (!form.title || !form.artist) {
      setError("Título e artista são obrigatórios.")
      return
    }

    setLoading(true)
    const result = await createArtworkAction(form)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="adminPage">
      <div className="adminPageHeader">
        <div>
          <AdminBreadcrumb crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Obras", href: "/admin/artworks" }, { label: "Nova Obra" }]} />
          <h1>Nova Obra</h1>
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
            <label className="adminLabel">Artista *</label>
            <input name="artist" value={form.artist} onChange={handleChange} />
          </div>

          <div className="adminFormGroup">
            <label className="adminLabel">Ano</label>
            <input name="year" value={form.year} onChange={handleChange} />
          </div>

          <div className="adminFormGroup">
            <label className="adminLabel">Dimensões</label>
            <input name="dimensions" placeholder="ex: 80 × 60 cm" value={form.dimensions} onChange={handleChange} />
          </div>

          <div className="adminFormGroup">
            <label className="adminLabel">Categoria</label>
            <select name="category" value={form.category} onChange={handleChange} className="adminSelect">
              <option value="">Selecionar...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="adminFormGroup">
            <label className="adminLabel">Disponibilidade</label>
            <select name="available" value={form.available} onChange={handleChange} className="adminSelect">
              <option value="disponível">Disponível</option>
              <option value="vendido">Vendido</option>
            </select>
          </div>

          <div className="adminFormGroup adminFormGroup--full">
            <label className="adminLabel">URL da Imagem</label>
            <input name="image_url" value={form.image_url} onChange={handleChange} />
            {form.image_url && (
              <div className="adminImagePreview">
                <Image
                  src={form.image_url}
                  alt="Preview"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="260px"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                />
              </div>
            )}
          </div>

          <div className="adminFormGroup adminFormGroup--full">
            <label className="adminLabel">
              Descrição
              <span className="adminCharCount">{form.description.length} caracteres</span>
            </label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
          </div>

          <div className="adminFormGroup adminFormGroup--full">
            <label className="adminToggle">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
              />
              <span className="adminToggleTrack" />
              <span className="adminToggleLabel">Marcar como destaque</span>
            </label>
          </div>
        </div>

        <div className="adminFormActions">
          <button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar obra"}
          </button>
          <Link href="/admin/artworks">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}