import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  if (cookieStore.get("admin")?.value !== "true") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get("logo")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo inválido." }, { status: 400 })
  }

  const allowedTypes = ["image/png", "image/svg+xml", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Formato não suportado. Use PNG, SVG ou WEBP." }, { status: 400 })
  }

  const maxSize = 2 * 1024 * 1024 // 2 MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: "Arquivo muito grande. Máximo 2 MB." }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const publicDir = path.join(process.cwd(), "public")
  await writeFile(path.join(publicDir, "logo.png"), buffer)

  return NextResponse.json({ ok: true })
}
