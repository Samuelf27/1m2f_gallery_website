export const WHATSAPP_NUMBER = "5511999449449"
export const WHATSAPP_URL   = `https://wa.me/${WHATSAPP_NUMBER}`
export const SITE_URL       = "https://1m2f-gallery-website.vercel.app"

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : process.env.NODE_ENV === "development"
      ? "http://localhost:5000/api"
      : "https://onem2f-gallery-website.onrender.com/api"

export const API_URL              = `${API_BASE}/artworks`
export const EXHIBITIONS_API_URL  = `${API_BASE}/exhibitions`
export const TESTIMONIALS_API_URL = `${API_BASE}/testimonials`
export const SETTINGS_API_URL     = `${API_BASE}/settings`
export const AUDIT_LOGS_API_URL   = `${API_BASE}/audit-logs`
