"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

type Toast = { text: string; type: "success" | "error" }

export default function AdminToast() {
  const searchParams = useSearchParams()
  const [toast, setToast]   = useState<Toast | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const msg = searchParams.get("msg")
    const err = searchParams.get("err")
    if (!msg && !err) return

    setToast({ text: msg ?? err!, type: msg ? "success" : "error" })
    setVisible(true)

    const url = new URL(window.location.href)
    url.searchParams.delete("msg")
    url.searchParams.delete("err")
    window.history.replaceState({}, "", url.toString())

    const t = setTimeout(() => setVisible(false), 3500)
    return () => clearTimeout(t)
  }, [searchParams])

  if (!toast) return null

  return (
    <div className={`adminToast adminToast--${toast.type}${visible ? " adminToast--visible" : ""}`}>
      <span className="adminToastIcon">
        {toast.type === "success" ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
          </svg>
        )}
      </span>
      {toast.text}
    </div>
  )
}
