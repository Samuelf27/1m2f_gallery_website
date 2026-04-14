import type { NextConfig } from "next"

const ALLOWED_IMAGE_DOMAINS = [
  "res.cloudinary.com",
  "images.unsplash.com",
  "upload.wikimedia.org",
  "i.imgur.com",
  "onem2f-gallery-website.onrender.com",
]

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: ALLOWED_IMAGE_DOMAINS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
}

export default nextConfig