"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { API_URL } from "@/lib/config"

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.API_SECRET_KEY ?? ""}`,
  }
}

// --- Auth ---

export async function loginAction(password: string): Promise<{ error: string } | never> {
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Senha incorreta. Tente novamente." }
  }

  const cookieStore = await cookies()
  cookieStore.set("admin", "true", {
    path: "/",
    maxAge: 28800, // 8 horas
    sameSite: "strict",
    httpOnly: true,
  })

  redirect("/admin")
}

export async function logoutAction(): Promise<never> {
  const cookieStore = await cookies()
  cookieStore.delete("admin")
  redirect("/admin/login")
}

// --- Artworks ---

type ArtworkFormData = {
  title: string
  artist: string
  year: string
  description: string
  image_url: string
  category: string
}

export async function createArtworkAction(
  data: ArtworkFormData
): Promise<{ error: string } | never> {
  const res = await fetch(API_URL + "/", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    return { error: "Erro ao criar obra. Tente novamente." }
  }

  redirect("/admin/artworks")
}

export async function updateArtworkAction(
  id: number,
  data: ArtworkFormData
): Promise<{ error: string } | never> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    return { error: "Erro ao atualizar obra. Tente novamente." }
  }

  redirect("/admin/artworks")
}

export async function deleteArtworkAction(
  id: number
): Promise<{ error: string } | { success: true }> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${process.env.API_SECRET_KEY ?? ""}` },
  })

  if (!res.ok) {
    return { error: "Erro ao deletar obra. Tente novamente." }
  }

  return { success: true }
}