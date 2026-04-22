"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { getSettings } from "@/services/api"
import { updateSettingsAction } from "@/app/admin/actions"
import AdminBreadcrumb from "@/app/admin/_components/AdminBreadcrumb"

type Settings = {
  whatsapp: string
  email: string
  address: string
  instagram: string
  facebook: string
  gallery_description: string
}

const DEFAULTS: Settings = {
  whatsapp:            "5511999449449",
  email:               "",
  address:             "",
  instagram:           "",
  facebook:            "",
  gallery_description: "",
}

export default function AdminConfiguracoes() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking")

  // Logo state
  const [preview, setPreview]   = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [logoSuccess, setLogoSuccess] = useState(false)
  const [logoError, setLogoError]     = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getSettings().then((data) => {
      setSettings({ ...DEFAULTS, ...data })
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const base = process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : "https://onem2f-gallery-website.onrender.com"
    fetch(base + "/")
      .then((r) => setApiStatus(r.ok ? "online" : "offline"))
      .catch(() => setApiStatus("offline"))
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSaveSection(keys: (keyof Settings)[]) {
    setSaving(true)
    setSaved(null)
    setSaveError(null)
    const payload = Object.fromEntries(keys.map((k) => [k, settings[k]]))
    const result = await updateSettingsAction(payload)
    setSaving(false)
    if ("error" in result) {
      setSaveError(result.error)
    } else {
      setSaved(keys[0])
      setTimeout(() => setSaved(null), 3000)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setLogoError("Selecione um arquivo de imagem válido.")
      return
    }
    setLogoError(null)
    setLogoSuccess(false)
    setPreview(URL.createObjectURL(file))
  }

  async function handleLogoUpload(e: { preventDefault(): void }) {
    e.preventDefault()
    const file = inputRef.current?.files?.[0]
    if (!file) return
    setUploading(true)
    setLogoError(null)
    setLogoSuccess(false)
    try {
      const formData = new FormData()
      formData.append("logo", file)
      const res = await fetch("/api/admin/upload-logo", { method: "POST", body: formData })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Erro ao enviar o arquivo.")
      }
      setLogoSuccess(true)
      setPreview(null)
      if (inputRef.current) inputRef.current.value = ""
    } catch (err) {
      setLogoError(err instanceof Error ? err.message : "Erro desconhecido.")
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div className="adminLoading">Carregando configurações…</div>

  return (
    <div className="adminPage">
      <div className="adminPageHeader">
        <div>
          <AdminBreadcrumb crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Configurações" }]} />
          <h1>Configurações</h1>
        </div>
      </div>

      {saveError && <p className="adminError">{saveError}</p>}

      {/* ── Status do sistema ─────────────────────────────────── */}
      <div className="adminSection">
        <h2 className="adminSectionTitle">Status do sistema</h2>
        <div className="adminStatusGrid">
          <div className="adminStatusItem">
            <span className="adminStatusDot adminStatusDot--green" />
            <span>Frontend (Vercel)</span>
            <span className="adminStatusValue adminStatusValue--green">Online</span>
          </div>
          <div className="adminStatusItem">
            <span className={`adminStatusDot ${apiStatus === "online" ? "adminStatusDot--green" : apiStatus === "offline" ? "adminStatusDot--red" : "adminStatusDot--yellow"}`} />
            <span>Backend (Render)</span>
            <span className={`adminStatusValue ${apiStatus === "online" ? "adminStatusValue--green" : apiStatus === "offline" ? "adminStatusValue--red" : ""}`}>
              {apiStatus === "checking" ? "Verificando…" : apiStatus === "online" ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Informações de contato ────────────────────────────── */}
      <div className="adminSection">
        <h2 className="adminSectionTitle">Informações de contato</h2>
        <div className="adminForm">
          <div className="adminFormGrid">
            <div className="adminFormGroup">
              <label className="adminLabel">WhatsApp (número com DDI)</label>
              <input
                name="whatsapp"
                value={settings.whatsapp}
                onChange={handleChange}
                placeholder="5511999999999"
              />
              <p className="adminLogoHint">Ex: 5511999449449 — sem espaços ou símbolos</p>
            </div>
            <div className="adminFormGroup">
              <label className="adminLabel">E-mail de contato</label>
              <input
                name="email"
                type="email"
                value={settings.email}
                onChange={handleChange}
                placeholder="contato@galeria.com.br"
              />
            </div>
            <div className="adminFormGroup adminFormGroup--full">
              <label className="adminLabel">Endereço</label>
              <input
                name="address"
                value={settings.address}
                onChange={handleChange}
                placeholder="Rua Exemplo, 123 — São Paulo, SP"
              />
            </div>
          </div>
          <div className="adminFormActions">
            <button
              type="button"
              className="adminButton"
              disabled={saving}
              onClick={() => handleSaveSection(["whatsapp", "email", "address"])}
            >
              {saving ? "Salvando…" : saved === "whatsapp" ? "✓ Salvo!" : "Salvar contato"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Redes sociais ─────────────────────────────────────── */}
      <div className="adminSection">
        <h2 className="adminSectionTitle">Redes sociais</h2>
        <div className="adminForm">
          <div className="adminFormGrid">
            <div className="adminFormGroup">
              <label className="adminLabel">Instagram (URL completa)</label>
              <input
                name="instagram"
                value={settings.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/galeria"
              />
            </div>
            <div className="adminFormGroup">
              <label className="adminLabel">Facebook (URL completa)</label>
              <input
                name="facebook"
                value={settings.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/galeria"
              />
            </div>
          </div>
          <div className="adminFormActions">
            <button
              type="button"
              className="adminButton"
              disabled={saving}
              onClick={() => handleSaveSection(["instagram", "facebook"])}
            >
              {saving ? "Salvando…" : saved === "instagram" ? "✓ Salvo!" : "Salvar redes"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Sobre a galeria ───────────────────────────────────── */}
      <div className="adminSection">
        <h2 className="adminSectionTitle">Sobre a galeria</h2>
        <div className="adminForm">
          <div className="adminFormGrid">
            <div className="adminFormGroup adminFormGroup--full">
              <label className="adminLabel">
                Descrição curta
                <span className="adminCharCount">{settings.gallery_description.length} caracteres</span>
              </label>
              <textarea
                name="gallery_description"
                value={settings.gallery_description}
                onChange={handleChange}
                rows={4}
                placeholder="Breve descrição da galeria para exibir no site…"
              />
            </div>
          </div>
          <div className="adminFormActions">
            <button
              type="button"
              className="adminButton"
              disabled={saving}
              onClick={() => handleSaveSection(["gallery_description"])}
            >
              {saving ? "Salvando…" : saved === "gallery_description" ? "✓ Salvo!" : "Salvar descrição"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Logo do site ─────────────────────────────────────── */}
      <div className="adminSection">
        <h2 className="adminSectionTitle">Logo do site</h2>
        <div className="adminLogoPanel">
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

        <form onSubmit={handleLogoUpload} className="adminLogoForm">
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
          {logoError   && <p className="adminError">{logoError}</p>}
          {logoSuccess && <p className="adminSuccess">Logo atualizado. Recarregue a página para ver a mudança.</p>}
          <button type="submit" className="adminButton" disabled={!preview || uploading}>
            {uploading ? "Enviando…" : "Salvar novo logo"}
          </button>
        </form>
      </div>

      {/* ── Identidade visual ─────────────────────────────────── */}
      <div className="adminSection">
        <h2 className="adminSectionTitle">Identidade visual</h2>
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
