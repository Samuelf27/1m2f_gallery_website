"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

const STORAGE_KEY = "1m2f_favorites"

type FavCtx = {
  ids: number[]
  toggle: (id: number) => void
  isFav: (id: number) => boolean
  count: number
}

const Ctx = createContext<FavCtx>({
  ids: [],
  toggle: () => {},
  isFav: () => false,
  count: 0,
})

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setIds(JSON.parse(raw))
    } catch {}
  }, [])

  function toggle(id: number) {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  return (
    <Ctx.Provider value={{ ids, toggle, isFav: (id) => ids.includes(id), count: ids.length }}>
      {children}
    </Ctx.Provider>
  )
}

export function useFavorites() {
  return useContext(Ctx)
}
