import type { NextConfig } from "next"

const ALLOWED_IMAGE_DOMAINS = [
  "res.cloudinary.com",
  "images.unsplash.com",
  "upload.wikimedia.org",
  "i.imgur.com",
  "onem2f-gallery-website.onrender.com",
]

const nextConfig: NextConfig = {
  compress: true,
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: ALLOWED_IMAGE_DOMAINS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
    formats: ["image/avif", "image/webp"],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options",    value: "nosniff" },
        { key: "X-Frame-Options",           value: "DENY" },
        { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
      ],
    },
    {
      // Cache longo para assets estáticos imutáveis
      source: "/_next/static/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      // Cache moderado para imagens públicas
      source: "/images/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
      ],
    },
  ],
}

export default nextConfig
