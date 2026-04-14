"use client"

import { useEffect, useRef, useState } from "react"

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const pos     = useRef({ x: -100, y: -100 })
  const ring    = useRef({ x: -100, y: -100 })
  const raf     = useRef<number>(0)

  useEffect(() => {
    // Only on pointer devices (not touch-only)
    if (window.matchMedia("(hover: none)").matches) return

    function onMove(e: MouseEvent) {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }

    function animate() {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`
      }
      raf.current = requestAnimationFrame(animate)
    }

    function onDown() { setActive(true)  }
    function onUp()   { setActive(false) }

    function onEnterLink(e: MouseEvent) {
      const el = e.target as HTMLElement
      if (el.closest("a, button, [role='button']")) setActive(true)
    }
    function onLeaveLink(e: MouseEvent) {
      const el = e.target as HTMLElement
      if (el.closest("a, button, [role='button']")) setActive(false)
    }

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mousedown", onDown)
    document.addEventListener("mouseup",   onUp)
    document.addEventListener("mouseover", onEnterLink)
    document.addEventListener("mouseout",  onLeaveLink)
    raf.current = requestAnimationFrame(animate)

    // Hide default cursor globally
    document.documentElement.style.cursor = "none"

    return () => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("mouseup",   onUp)
      document.removeEventListener("mouseover", onEnterLink)
      document.removeEventListener("mouseout",  onLeaveLink)
      cancelAnimationFrame(raf.current)
      document.documentElement.style.cursor = ""
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className={`cursorDot${active  ? " cursorDot--active"  : ""}`} aria-hidden="true" />
      <div ref={ringRef} className={`cursorRing${active ? " cursorRing--active" : ""}`} aria-hidden="true" />
    </>
  )
}
