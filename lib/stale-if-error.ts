import type { Context, Next } from 'hono'

// How long a good answer is kept as a fallback for when the upstream fails
const KEEP_SECONDS = 7 * 24 * 60 * 60

const STORED_AT = 'X-Stored-At'
const ORIGINAL_CACHE_CONTROL = 'X-Original-Cache-Control'
// HIT: fresh stored answer. STALE: upstream failed, stored answer used. MISS: upstream asked.
const CACHE_STATUS = 'X-Release-Cache'

function restore(stored: Response, stale: boolean) {
  const response = new Response(stored.body, stored)
  response.headers.set('Cache-Control', stale ? 'no-store' : response.headers.get(ORIGINAL_CACHE_CONTROL) ?? 'no-store')
  response.headers.delete(STORED_AT)
  response.headers.delete(ORIGINAL_CACHE_CONTROL)
  response.headers.set(CACHE_STATUS, stale ? 'STALE' : 'HIT')
  return response
}

// Serves the last good response while it is fresh, and falls back to it when
// the handler fails. Freshness comes from the response's own max-age, so
// GitHub is asked at most once per max-age per edge location, and an upstream
// failure only reaches the client if there has never been a good answer.
export function staleIfError(defaultMaxAge?: number) {
  return async (c: Context, next: Next) => {
    const cache = (globalThis as any).caches?.default
    if (!cache || !['GET', 'HEAD'].includes(c.req.method)) return next()

    // HEAD and GET share an entry; firmware update checks are HEAD requests
    const key = new Request(c.req.url, { method: 'GET' })
    const stored: Response | undefined = await cache.match(key)
    if (stored) {
      const age = (Date.now() - Number(stored.headers.get(STORED_AT))) / 1000
      const maxAge = Number(stored.headers.get(ORIGINAL_CACHE_CONTROL)?.match(/max-age=(\d+)/)?.[1] ?? 0)
      if (age < maxAge) return restore(stored, false)
    }

    await next()

    if (c.res.status >= 500) {
      if (stored) c.res = restore(stored, true)
      return
    }
    if (defaultMaxAge !== undefined && !c.res.headers.has('Cache-Control')) {
      c.res.headers.set('Cache-Control', `public, max-age=${defaultMaxAge}`)
    }
    if (c.res.status === 200 || c.res.status === 302) {
      const copy = new Response(c.res.clone().body, c.res)
      copy.headers.set(ORIGINAL_CACHE_CONTROL, c.res.headers.get('Cache-Control') ?? '')
      copy.headers.set('Cache-Control', `public, max-age=${KEEP_SECONDS}`)
      copy.headers.set(STORED_AT, String(Date.now()))
      await cache.put(key, copy)
      c.res.headers.set(CACHE_STATUS, 'MISS')
    }
  }
}
