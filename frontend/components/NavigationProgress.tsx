"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function Progress() {
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible]   = useState(false)

  useEffect(() => {
    setVisible(true)
    setProgress(20)

    const t1 = setTimeout(() => setProgress(60),  120)
    const t2 = setTimeout(() => setProgress(85),  350)
    const t3 = setTimeout(() => setProgress(100), 600)
    const t4 = setTimeout(() => setVisible(false), 900)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [pathname, searchParams])

  if (!visible) return null

  return (
    <div
      className="navProgress"
      style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
      aria-hidden="true"
    />
  )
}

export default function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <Progress />
    </Suspense>
  )
}
