type Entry = { count: number; reset: number }
const store = new Map<string, Entry>()

export function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now > entry.reset) {
    store.set(ip, { count: 1, reset: now + windowMs })
    return false
  }

  if (entry.count >= limit) return true
  entry.count++
  return false
}