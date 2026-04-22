"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"

interface Props {
  src: string
  alt: string
}

export default function ImageLightbox({ src, alt }: Props) {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, close])

  return (
    <>
      <button
        type="button"
        className="lightboxTrigger"
        onClick={() => setOpen(true)}
        aria-label="Ampliar imagem"
        title="Clique para ampliar"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="lightboxOverlay"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            type="button"
            className="lightboxClose"
            onClick={close}
            aria-label="Fechar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="lightboxContent" onClick={(e) => e.stopPropagation()}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              style={{ objectFit: "contain" }}
              quality={95}
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}
