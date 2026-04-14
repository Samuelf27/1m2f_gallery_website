"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getArtworks } from "@/services/api"
import type { Artwork } from "@/types/artwork.types"

type Result = Artwork & { _type: "artwork" }

let cachedArtworks: Artwork[] | null = null

export default function GlobalSearch() {
  const router     = useRouter()
  const inputRef   = useRef<HTMLInputElement>(null)
  const [open, setOpen]       = useState(false)
  const [query, setQuery]     = useState("")
  const [artworks, setArtworks] = useState<Artwork[]>(cachedArtworks ?? [])
  const [active, setActive]   = useState(0)

  /* Fetch once, cache globally */
  useEffect(() => {
    if (cachedArtworks) return
    getArtworks().then((data) => {
      cachedArtworks = data
      setArtworks(data)
    }).catch(() => {})
  }, [])

  /* ⌘K / Ctrl+K */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  /* Focus input on open */
  useEffect(() => {
    if (open) {
      setQuery("")
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  const results: Result[] = query.trim().length < 2 ? [] :
    artworks
      .filter((a) => {
        const q = query.toLowerCase()
        return a.title.toLowerCase().includes(q) || a.category?.toLowerCase().includes(q)
      })
      .slice(0, 8)
      .map((a) => ({ ...a, _type: "artwork" as const }))

  function navigate(art: Result) {
    router.push(`/artworks?obra=${art.id}`)
    setOpen(false)
  }

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((n) => Math.min(n + 1, results.length - 1)) }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive((n) => Math.max(n - 1, 0)) }
    if (e.key === "Enter" && results[active]) navigate(results[active])
  }, [results, active]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return (
    <button
      type="button"
      className="globalSearchTrigger"
      onClick={() => setOpen(true)}
      aria-label="Buscar"
      title="Buscar (⌘K)"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" />
      </svg>
      <span className="globalSearchHint">⌘K</span>
    </button>
  )

  return (
    <div className="globalSearchOverlay" onClick={() => setOpen(false)}>
      <div className="globalSearchPanel" onClick={(e) => e.stopPropagation()}>

        {/* Input */}
        <div className="globalSearchInputRow">
          <svg className="globalSearchIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            className="globalSearchInput"
            placeholder="Buscar obras, categorias…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0) }}
            onKeyDown={onKeyDown}
            autoComplete="off"
          />
          <kbd className="globalSearchEsc" onClick={() => setOpen(false)}>ESC</kbd>
        </div>

        {/* Results */}
        {query.trim().length >= 2 && (
          <div className="globalSearchResults">
            {results.length === 0 ? (
              <p className="globalSearchEmpty">Nenhuma obra encontrada para &ldquo;{query}&rdquo;</p>
            ) : (
              <ul className="globalSearchList">
                {results.map((art, i) => (
                  <li key={art.id}>
                    <button
                      type="button"
                      className={`globalSearchItem${i === active ? " globalSearchItem--active" : ""}`}
                      onClick={() => navigate(art)}
                      onMouseEnter={() => setActive(i)}
                    >
                      <div className="globalSearchThumb">
                        <Image
                          src={art.image_url}
                          alt={art.title}
                          fill
                          sizes="48px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="globalSearchItemText">
                        <span className="globalSearchItemTitle">{art.title}</span>
                        {art.category && (
                          <span className="globalSearchItemCat">{art.category}</span>
                        )}
                      </div>
                      <svg className="globalSearchItemArrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {query.trim().length < 2 && (
          <p className="globalSearchHintText">Digite ao menos 2 caracteres para buscar</p>
        )}
      </div>
    </div>
  )
}
