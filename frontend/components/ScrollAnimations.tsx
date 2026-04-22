"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ScrollAnimations() {
  const pathname = usePathname()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible") }),
      { threshold: 0.08 }
    )
    const els = document.querySelectorAll(".anim:not(.visible)")
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])

  return null
}
