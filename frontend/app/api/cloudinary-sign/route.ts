import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST() {
  const apiSecret  = process.env.CLOUDINARY_API_SECRET
  const apiKey     = process.env.CLOUDINARY_API_KEY
  const cloudName  = process.env.CLOUDINARY_CLOUD_NAME

  if (!apiSecret || !apiKey || !cloudName) {
    return NextResponse.json({ error: "Cloudinary não configurado." }, { status: 503 })
  }

  const timestamp = Math.round(Date.now() / 1000)
  const folder    = "1m2f-gallery"
  const params    = `folder=${folder}&timestamp=${timestamp}`
  const signature = crypto
    .createHash("sha256")
    .update(params + apiSecret)
    .digest("hex")

  return NextResponse.json({ timestamp, signature, apiKey, cloudName, folder })
}
