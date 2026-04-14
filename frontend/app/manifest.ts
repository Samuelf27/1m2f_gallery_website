import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             "1M2F Gallery — Maria França",
    short_name:       "1M2F Gallery",
    description:      "Galeria de arte contemporânea de Maria França. Mais de 6.000 obras originais.",
    start_url:        "/",
    display:          "standalone",
    background_color: "#0a0a0a",
    theme_color:      "#0a0a0a",
    orientation:      "portrait-primary",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    screenshots: [
      {
        src:          "/screenshot-home.jpg",
        sizes:        "1280x720",
        type:         "image/jpeg",
        form_factor:  "wide",
        label:        "Página inicial da 1M2F Gallery",
      },
    ],
    categories: ["lifestyle", "art", "shopping"],
  }
}
