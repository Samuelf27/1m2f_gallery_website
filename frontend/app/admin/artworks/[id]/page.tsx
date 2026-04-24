"use client"

import { useEffect, useState } from "react"
import { getArtwork } from "@/services/api"
import { updateArtworkAction } from "@/app/admin/actions"
import AdminBreadcrumb from "@/app/admin/_components/AdminBreadcrumb"
import type { Artwork } from "@/types/artwork.types"
import Link from "next/link"
import Image from "next/image"
import CloudinaryUpload from "@/components/CloudinaryUpload"

const CATEGORIES = ["Pintura", "Escultura", "Fotografia", "Gravura", "Desenho", "Mista", "Digital", "Outra"]

export default function EditArtwork({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

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

  useEffect(() => {
    params.then(({ id }) => {
      setId(id)
      getArtwork(id)
        .then((art: Artwork) => {
          setForm({
            title: art.title,
            artist: art.artist ?? "",
            year: art.year,
            description: art.description,
            image_url: art.image_url,
            category: art.category,
            dimensions: art.dimensions ?? "",
            available: art.available ?? "disponível",
            featured: art.featured ?? false,
          })
        })
        .catch(() => setError("Não foi possível carregar a obra."))
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

    if (!form.title || !form.artist) {
      setError("Título e artista são obrigatórios.")
      return
    }

    setLoading(true)
    const result = await updateArtworkAction(Number(id), form)

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
          <AdminBreadcrumb crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Obras", href: "/admin/artworks" }, { label: "Editar" }]} />
          <h1>Editar Obra</h1>
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
            <label className="adminLabel">Imagem</label>
            <CloudinaryUpload
              currentUrl={form.image_url}
              onUpload={(url) => setForm((f) => ({ ...f, image_url: url }))}
            />
            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="Ou cole uma URL externa"
              style={{ marginTop: 8 }}
            />
            {form.image_url && !form.image_url.startsWith("blob:") && (
              <div className="adminImagePreview">
                <Image src={form.image_url} alt="Preview" fill style={{ objectFit: "cover" }} sizes="260px"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
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
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
          <Link href="/admin/artworks">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}