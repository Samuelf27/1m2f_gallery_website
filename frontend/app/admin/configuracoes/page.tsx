"use client"

import { useState, useRef } from "react"
import Image from "next/image"

export default function AdminConfiguracoes() {
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem válido.")
      return
    }
    setError(null)
    setSuccess(false)
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const file = inputRef.current?.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append("logo", file)

      const res = await fetch("/api/admin/upload-logo", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Erro ao enviar o arquivo.")
      }

      setSuccess(true)
      setPreview(null)
      if (inputRef.current) inputRef.current.value = ""
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="adminPage">
      <div className="adminPageHeader">
        <div>
          <p className="adminPageLabel">Sistema</p>
          <h1>Configurações</h1>
        </div>
      </div>

      {/* Logo section */}
      <div className="adminSection">
        <h2 className="adminSectionTitle">Logo do Site</h2>

        <div className="adminLogoPanel">
          {/* Current logo */}
          <div className="adminLogoBlock">
            <p className="adminLogoBlockLabel">Logo atual</p>
            <div className="adminLogoPreviewBox adminLogoPreviewBox--dark">
              <Image
                src={`/logo.png?t=${Date.now()}`}
                alt="Logo atual"
                width={160}
                height={60}
                style={{ objectFit: "contain" }}
                priority
                unoptimized
              />
            </div>
            <p className="adminLogoHint">Exibido na navbar e no rodapé do site</p>
          </div>

          {/* Preview of new logo */}
          {preview && (
            <div className="adminLogoBlock">
              <p className="adminLogoBlockLabel">Novo logo (pré-visualização)</p>
              <div className="adminLogoPreviewBox adminLogoPreviewBox--dark">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Preview" style={{ maxWidth: 160, maxHeight: 60, objectFit: "contain" }} />
              </div>
              <div className="adminLogoPreviewBox adminLogoPreviewBox--light">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Preview claro" style={{ maxWidth: 160, maxHeight: 60, objectFit: "contain" }} />
              </div>
              <p className="adminLogoHint">Verifique como o logo aparece em fundos escuro e claro</p>
            </div>
          )}
        </div>

        {/* Upload form */}
        <form onSubmit={handleUpload} className="adminLogoForm">
          <div className="adminFormGroup">
            <label className="adminLabel">Substituir logo</label>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/svg+xml,image/webp"
              onChange={handleFileChange}
              className="adminFileInput"
            />
            <p className="adminLogoHint">Formatos aceitos: PNG, SVG, WEBP · Recomendado: fundo transparente, proporção ~3:1</p>
          </div>

          {error && <p className="adminError">{error}</p>}
          {success && <p className="adminSuccess">Logo atualizado com sucesso. Recarregue a página para ver a mudança.</p>}

          <button
            type="submit"
            className="adminButton"
            disabled={!preview || uploading}
          >
            {uploading ? "Enviando…" : "Salvar novo logo"}
          </button>
        </form>
      </div>

      {/* Site info */}
      <div className="adminSection">
        <h2 className="adminSectionTitle">Identidade Visual</h2>
        <div className="adminInfoGrid">
          <div className="adminInfoItem">
            <span className="adminInfoLabel">Nome do site</span>
            <span className="adminInfoValue">1M2F Gallery</span>
          </div>
          <div className="adminInfoItem">
            <span className="adminInfoLabel">Cores principais</span>
            <div className="adminColorSwatches">
              <span className="adminColorSwatch" style={{ background: "#c9a96e" }} title="#c9a96e (Gold)" />
              <span className="adminColorSwatch" style={{ background: "#080808" }} title="#080808 (Black)" />
              <span className="adminColorSwatch" style={{ background: "#f0ede8" }} title="#f0ede8 (White)" />
            </div>
          </div>
          <div className="adminInfoItem">
            <span className="adminInfoLabel">Tipografia principal</span>
            <span className="adminInfoValue" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Cormorant Garamond</span>
          </div>
          <div className="adminInfoItem">
            <span className="adminInfoLabel">Tipografia corpo</span>
            <span className="adminInfoValue">Inter</span>
          </div>
        </div>
      </div>
    </div>
  )
}
