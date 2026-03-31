"use client"

import { useState } from "react"
import { createArtwork } from "@/services/api"
import { useRouter } from "next/navigation"

export default function NewArtwork() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: "",
    artist: "",
    year: "",
    description: "",
    image_url: "",
    category: "",
  })

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
      await createArtwork(form)
      router.push("/admin/artworks")
    } catch {
      setError("Erro ao criar obra. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="adminPage">
      <h1>Nova Obra</h1>

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
            {loading ? "Criando..." : "Criar obra"}
          </button>
          <a href="/admin/artworks">Cancelar</a>
        </div>
      </form>
    </div>
  )
}
