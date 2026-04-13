"use client"

import { useFavorites } from "@/context/FavoritesContext"

type Props = {
  id: number
  className?: string
}

export default function FavoriteButton({ id, className }: Props) {
  const { isFav, toggle } = useFavorites()
  const active = isFav(id)

  return (
    <button
      type="button"
      className={`favBtn${active ? " favBtn--active" : ""}${className ? ` ${className}` : ""}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(id)
      }}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      title={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )
}
