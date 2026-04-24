"use client"

import { useRef, useState } from "react"
import Image from "next/image"

type Props = {
  onUpload: (url: string) => void
  currentUrl?: string
}

export default function CloudinaryUpload({ onUpload, currentUrl }: Props) {
  const inputRef                  = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [preview, setPreview]     = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem.")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Imagem muito grande (máx 10 MB).")
      return
    }

    setError(null)
    setPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      // 1. Obter assinatura do servidor
      const signRes = await fetch("/api/cloudinary-sign", { method: "POST" })
      if (!signRes.ok) throw new Error("Erro ao assinar upload.")
      const { timestamp, signature, apiKey, cloudName, folder } = await signRes.json()

      // 2. Fazer upload direto para Cloudinary
      const formData = new FormData()
      formData.append("file",      file)
      formData.append("timestamp", String(timestamp))
      formData.append("signature", signature)
      formData.append("api_key",   apiKey)
      formData.append("folder",    folder)

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      )
      if (!uploadRes.ok) throw new Error("Erro ao enviar imagem.")
      const data = await uploadRes.json()

      onUpload(data.secure_url)
      setPreview(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido.")
      setPreview(null)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const displayUrl = preview || currentUrl

  return (
    <div className="cloudinaryUpload">
      {displayUrl && (
        <div className="cloudinaryPreview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayUrl} alt="Preview" />
          {uploading && <div className="cloudinaryOverlay">Enviando…</div>}
        </div>
      )}

      <div className="cloudinaryActions">
        <button
          type="button"
          className="adminButtonSecondary"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Enviando…" : currentUrl ? "Trocar imagem" : "Fazer upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: "none" }}
        />
        <span className="adminLogoHint">JPG, PNG, WEBP · máx 10 MB</span>
      </div>

      {error && <p className="adminError">{error}</p>}
    </div>
  )
}
