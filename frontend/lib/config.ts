export const WHATSAPP_NUMBER = "5511999449449"
export const WHATSAPP_URL   = `https://wa.me/${WHATSAPP_NUMBER}`
export const SITE_URL       = "https://1m2f-gallery.vercel.app"

export const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/artworks"
    : "https://onem2f-gallery-website.onrender.com/api/artworks"
