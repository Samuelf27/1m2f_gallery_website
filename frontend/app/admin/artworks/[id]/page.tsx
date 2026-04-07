"use client"

import { useEffect, useState } from "react"
import { getArtwork } from "@/services/api"
import { updateArtworkAction } from "@/app/admin/actions"
import type { Artwork } from "@/types/artwork.types"
import Link from "next/link"

export default function EditArtwork({
  params,
}: {
  params: Promise<{ id: string }>
}) {
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
          })
        })
        .catch(() => setError("Não foi possível carregar a obra."))
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
    // Se não retornou erro, o server action fez redirect
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
          <Link href="/admin/artworks">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}