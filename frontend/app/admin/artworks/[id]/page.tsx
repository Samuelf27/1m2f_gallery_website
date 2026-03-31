"use client"

import { useEffect, useState } from "react"
import { getArtwork, updateArtwork } from "@/services/api"
import type { Artwork } from "@/types/artwork.types"
import { useRouter } from "next/navigation"

export default function EditArtwork({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
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
  })

  useEffect(() => {
    params.then(({ id }) => {
      getArtwork(id)
        .then((art: Artwork) => {
          setForm({
            title: art.title,
            artist: art.artist ?? "",
            year: art.year,
            description: art.description,
            image_url: art.image_url,
            category: art.category,
          })
        })
        .catch(() => setError("Não foi possível carregar a obra."))
        .finally(() => setFetching(false))
    })
  }, [])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.title || !form.artist) {
      setError("Título e artista são obrigatórios.")
      return
    }

    try {
      setLoading(true)
      const { id } = await params
      await updateArtwork(Number(id), form)
      router.push("/admin/artworks")
    } catch {
      setError("Erro ao atualizar obra. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="loading">Carregando...</div>

  return (
    <div className="adminPage">
      <h1>Editar Obra</h1>

      {error && <p className="errorMessage">{error}</p>}

      <form onSubmit={handleSubmit} className="adminForm">
        <input
          name="title"
          placeholder="Título *"
          value={form.title}
          onChange={handleChange}
        />
        <input
          name="artist"
          placeholder="Artista *"
          value={form.artist}
          onChange={handleChange}
        />
        <input
          name="year"
          placeholder="Ano"
          value={form.year}
          onChange={handleChange}
        />
        <input
          name="category"
          placeholder="Categoria"
          value={form.category}
          onChange={handleChange}
        />
        <input
          name="image_url"
          placeholder="URL da imagem"
          value={form.image_url}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Descrição"
          value={form.description}
          onChange={handleChange}
        />

        <div className="adminFormActions">
          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
          <a href="/admin/artworks">Cancelar</a>
        </div>
      </form>
    </div>
  )
}
