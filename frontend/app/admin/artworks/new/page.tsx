"use client"

import { useState } from "react"
import { API_URL } from "@/services/api"
import { useRouter } from "next/navigation"

export default function NewArtwork() {
  const router = useRouter()

  const [form, setForm] = useState({
    title: "",
    artist: "",
    image_url: "",
    description: ""
  })

  async function handleSubmit(e: any) {
    e.preventDefault()

    await fetch(`${API_URL}/api/artworks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })

    router.push("/admin/artworks")
  }

  return (
    <form onSubmit={handleSubmit} className="adminForm">
      <h1>Nova Obra</h1>

      <input placeholder="Título" onChange={e => setForm({...form, title: e.target.value})}/>
      <input placeholder="Artista" onChange={e => setForm({...form, artist: e.target.value})}/>
      <input placeholder="Imagem URL" onChange={e => setForm({...form, image_url: e.target.value})}/>
      <textarea placeholder="Descrição" onChange={e => setForm({...form, description: e.target.value})}/>

      <button>Criar</button>
    </form>
  )
}