import { WHATSAPP_URL } from "./config"

export function buildArtworkWhatsAppUrl(title: string, artist?: string | null): string {
  const artistPart = artist ? ` de ${artist}` : ""
  const msg = encodeURIComponent(
    `Olá! Tenho interesse em adquirir a obra "${title}"${artistPart}. Poderia me dar mais informações?`
  )
  return `${WHATSAPP_URL}?text=${msg}`
}
