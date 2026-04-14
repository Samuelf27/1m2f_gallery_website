"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const COOKIE_KEY = "1m2f_cookie_consent"

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_KEY)) {
        // Small delay so it doesn't flash immediately on load
        const t = setTimeout(() => setVisible(true), 1200)
        return () => clearTimeout(t)
      }
    } catch { /* ignore */ }
  }, [])

  function accept() {
    try { localStorage.setItem(COOKIE_KEY, "accepted") } catch { /* ignore */ }
    setVisible(false)
  }

  function decline() {
    try { localStorage.setItem(COOKIE_KEY, "declined") } catch { /* ignore */ }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookieBanner" role="dialog" aria-label="Aviso de cookies" aria-live="polite">
      <div className="cookieBannerInner">
        <div className="cookieBannerText">
          <p className="cookieBannerTitle">Privacidade & Cookies</p>
          <p className="cookieBannerDesc">
            Utilizamos cookies para melhorar sua experiência e analisar o uso do site, em conformidade com a{" "}
            <strong>LGPD</strong>. Ao continuar navegando você concorda com nossa{" "}
            <Link href="/privacidade" className="cookieBannerLink">política de privacidade</Link>.
          </p>
        </div>
        <div className="cookieBannerActions">
          <button type="button" className="cookieBannerDecline" onClick={decline}>
            Recusar
          </button>
          <button type="button" className="cookieBannerAccept" onClick={accept}>
            Aceitar cookies
          </button>
        </div>
      </div>
    </div>
  )
}
