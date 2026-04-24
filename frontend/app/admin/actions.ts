"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { API_URL, EXHIBITIONS_API_URL, TESTIMONIALS_API_URL, SETTINGS_API_URL } from "@/lib/config"

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.API_SECRET_KEY ?? ""}`,
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function loginAction(password: string): Promise<{ error: string } | never> {
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Senha incorreta. Tente novamente." }
  }

  const cookieStore = await cookies()
  cookieStore.set("admin", "true", {
    path: "/",
    maxAge: 28800,
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

// ─── Artworks ─────────────────────────────────────────────────────────────────

type ArtworkFormData = {
  title: string
  artist: string
  year: string
  description: string
  image_url: string
  category: string
  dimensions: string
  available: string
  featured: boolean
}

export async function createArtworkAction(
  data: ArtworkFormData
): Promise<{ error: string } | never> {
  const res = await fetch(API_URL + "/", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) return { error: "Erro ao criar obra. Tente novamente." }

  revalidatePath("/admin/artworks")
  revalidatePath("/admin")
  redirect("/admin/artworks?msg=Obra+criada+com+sucesso")
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

  if (!res.ok) return { error: "Erro ao atualizar obra. Tente novamente." }

  revalidatePath("/admin/artworks")
  revalidatePath(`/admin/artworks/${id}`)
  revalidatePath("/admin")
  redirect("/admin/artworks?msg=Obra+atualizada+com+sucesso")
}

export async function deleteArtworkAction(
  id: number
): Promise<{ error: string } | { success: true }> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${process.env.API_SECRET_KEY ?? ""}` },
  })

  if (!res.ok) return { error: "Erro ao deletar obra. Tente novamente." }

  revalidatePath("/admin/artworks")
  revalidatePath("/admin")
  return { success: true }
}

export async function toggleArtworkFeaturedAction(
  id: number,
  currentFeatured: boolean,
  currentData: ArtworkFormData
): Promise<{ error: string } | { success: true }> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ ...currentData, featured: !currentFeatured }),
  })
  if (!res.ok) return { error: "Erro ao atualizar destaque." }
  revalidatePath("/admin/artworks")
  revalidatePath("/admin")
  return { success: true }
}

export async function toggleArtworkAvailableAction(
  id: number,
  currentData: ArtworkFormData
): Promise<{ error: string } | { success: true }> {
  const newValue = currentData.available === "vendido" ? "disponível" : "vendido"
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ ...currentData, available: newValue }),
  })
  if (!res.ok) return { error: "Erro ao atualizar disponibilidade." }
  revalidatePath("/admin/artworks")
  revalidatePath("/admin")
  return { success: true }
}

export async function reorderArtworksAction(
  order: { id: number; sort_order: number }[]
): Promise<{ error: string } | { success: true }> {
  const res = await fetch(`${API_URL}/reorder`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(order),
  })
  if (!res.ok) return { error: "Erro ao reordenar obras." }
  revalidatePath("/admin/artworks")
  revalidatePath("/")
  return { success: true }
}

export async function duplicateArtworkAction(
  id: number
): Promise<{ error: string } | { success: true }> {
  const getRes = await fetch(`${API_URL}/${id}`)
  if (!getRes.ok) return { error: "Obra não encontrada." }
  const art = await getRes.json()

  const res = await fetch(API_URL + "/", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      title:       `${art.title} (cópia)`,
      artist:       art.artist,
      year:         art.year,
      description:  art.description,
      image_url:    art.image_url,
      category:     art.category,
      dimensions:   art.dimensions,
      available:    "disponível",
      featured:     false,
    }),
  })
  if (!res.ok) return { error: "Erro ao duplicar obra." }
  revalidatePath("/admin/artworks")
  revalidatePath("/admin")
  return { success: true }
}

export async function toggleTestimonialVisibleAction(
  id: number,
  currentVisible: boolean,
  currentData: TestimonialFormData
): Promise<{ error: string } | { success: true }> {
  const res = await fetch(`${TESTIMONIALS_API_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ ...currentData, visible: !currentVisible }),
  })
  if (!res.ok) return { error: "Erro ao atualizar visibilidade." }
  revalidatePath("/admin/depoimentos")
  revalidatePath("/admin")
  return { success: true }
}

// ─── Exhibitions ──────────────────────────────────────────────────────────────

type ExhibitionFormData = {
  title: string
  subtitle: string
  start_date: string
  end_date: string
  location: string
  description: string
}

export async function createExhibitionAction(
  data: ExhibitionFormData
): Promise<{ error: string } | never> {
  const res = await fetch(EXHIBITIONS_API_URL + "/", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) return { error: "Erro ao criar exposição. Tente novamente." }

  revalidatePath("/admin/exposicoes")
  revalidatePath("/admin")
  redirect("/admin/exposicoes?msg=Exposi%C3%A7%C3%A3o+criada+com+sucesso")
}

export async function updateExhibitionAction(
  id: number,
  data: ExhibitionFormData
): Promise<{ error: string } | never> {
  const res = await fetch(`${EXHIBITIONS_API_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) return { error: "Erro ao atualizar exposição. Tente novamente." }

  revalidatePath("/admin/exposicoes")
  revalidatePath(`/admin/exposicoes/${id}`)
  revalidatePath("/admin")
  redirect("/admin/exposicoes?msg=Exposi%C3%A7%C3%A3o+atualizada+com+sucesso")
}

export async function deleteExhibitionAction(
  id: number
): Promise<{ error: string } | { success: true }> {
  const res = await fetch(`${EXHIBITIONS_API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${process.env.API_SECRET_KEY ?? ""}` },
  })

  if (!res.ok) return { error: "Erro ao deletar exposição. Tente novamente." }

  revalidatePath("/admin/exposicoes")
  revalidatePath("/admin")
  return { success: true }
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

type TestimonialFormData = {
  name: string
  text: string
  city: string
  role: string
  visible: boolean
}

export async function createTestimonialAction(
  data: TestimonialFormData
): Promise<{ error: string } | never> {
  const res = await fetch(TESTIMONIALS_API_URL + "/", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) return { error: "Erro ao criar depoimento. Tente novamente." }

  revalidatePath("/admin/depoimentos")
  revalidatePath("/admin")
  redirect("/admin/depoimentos?msg=Depoimento+criado+com+sucesso")
}

export async function updateTestimonialAction(
  id: number,
  data: TestimonialFormData
): Promise<{ error: string } | never> {
  const res = await fetch(`${TESTIMONIALS_API_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) return { error: "Erro ao atualizar depoimento. Tente novamente." }

  revalidatePath("/admin/depoimentos")
  revalidatePath(`/admin/depoimentos/${id}`)
  revalidatePath("/admin")
  redirect("/admin/depoimentos?msg=Depoimento+atualizado+com+sucesso")
}

export async function deleteTestimonialAction(
  id: number
): Promise<{ error: string } | { success: true }> {
  const res = await fetch(`${TESTIMONIALS_API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${process.env.API_SECRET_KEY ?? ""}` },
  })

  if (!res.ok) return { error: "Erro ao deletar depoimento. Tente novamente." }

  revalidatePath("/admin/depoimentos")
  revalidatePath("/admin")
  return { success: true }
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function updateSettingsAction(
  data: Record<string, string>
): Promise<{ error: string } | { success: true }> {
  const res = await fetch(SETTINGS_API_URL + "/", {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) return { error: "Erro ao salvar configurações. Tente novamente." }

  revalidatePath("/admin/configuracoes")
  revalidatePath("/")
  return { success: true }
}