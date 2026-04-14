"use client"

import { useState } from "react"

interface ShareButtonProps {
  title: string
  artworkId: string
}

export default function ShareButton({ title, artworkId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = `${window.location.origin}/artwork/${artworkId}`
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Confira esta obra de Maria França: ${title}`,
          url,
        })
      } catch { /* usuário cancelou */ }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      type="button"
      className="artShareBtn"
      onClick={handleShare}
      aria-label="Compartilhar obra"
      title={copied ? "Link copiado!" : "Compartilhar"}
    >
      {copied ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
        </svg>
      )}
      <span>{copied ? "Link copiado!" : "Compartilhar"}</span>
    </button>
  )
}
