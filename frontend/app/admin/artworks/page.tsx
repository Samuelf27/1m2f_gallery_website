"use client"

import { useEffect, useState } from "react"
import { getArtworks } from "@/services/api"

export default function AdminArtworks() {
  const [artworks, setArtworks] = useState([])

  useEffect(() => {
    getArtworks().then(setArtworks)
  }, [])

  return (
    <div className="adminPage">
      <h1>Obras</h1>

      <a href="/admin/artworks/new">+ Nova Obra</a>

      {artworks.map((art: any) => (
        <div key={art.id} className="adminCard">
          <img src={art.image_url} />
          <h3>{art.title}</h3>

          <div>
            <a href={`/admin/artworks/${art.id}`}>Editar</a>
          </div>
        </div>
      ))}
    </div>
  )
}