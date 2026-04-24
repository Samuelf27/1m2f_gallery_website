import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AUDIT_LOGS_API_URL } from "@/lib/config"

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  if (!cookieStore.get("admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const params = new URLSearchParams()
  const page        = req.nextUrl.searchParams.get("page")
  const entity_type = req.nextUrl.searchParams.get("entity_type")
  if (page)        params.set("page", page)
  if (entity_type) params.set("entity_type", entity_type)
  params.set("per_page", "30")

  try {
    const res = await fetch(`${AUDIT_LOGS_API_URL}/?${params}`, {
      headers: { Authorization: `Bearer ${process.env.API_SECRET_KEY ?? ""}` },
    })
    if (!res.ok) return NextResponse.json({ items: [], total: 0, pages: 1, page: 1 })
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ items: [], total: 0, pages: 1, page: 1 })
  }
}
