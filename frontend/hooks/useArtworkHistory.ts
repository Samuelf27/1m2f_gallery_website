"use client"

import { useEffect, useState } from "react"

const HISTORY_KEY = "1m2f_history"
const HISTORY_MAX = 20

export function useArtworkHistory() {
  const [historyIds, setHistoryIds] = useState<number[]>([])

  useEffect(() => {
    try {
      const saved: number[] = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]")
      setHistoryIds(saved)
    } catch { /* ignore */ }
  }, [])

  function addToHistory(id: number) {
    try {
      const prev: number[] = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]")
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, HISTORY_MAX)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
      setHistoryIds(next)
    } catch { /* ignore */ }
  }

  return { historyIds, addToHistory }
}
