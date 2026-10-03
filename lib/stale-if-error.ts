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

// How long Cloudflare's CDN may keep serving an expired copy: immediately while
// it refreshes in the background, and when the refresh fails. Without this,
// every request that finds an expired copy waits on GitHub, and devices with
// short timeouts hang up.
const SERVE_STALE = 'stale-while-revalidate=86400, stale-if-error=86400'

function allowStale(response: Response) {
  const cacheControl = response.headers.get('Cache-Control')
  if (cacheControl?.includes('max-age=') && !cacheControl.includes('stale-while-revalidate')) {
    response.headers.set('Cache-Control', `${cacheControl}, ${SERVE_STALE}`)
  }
}

interface Options {
  // Return true to keep serving the stored answer instead of a fresh one that
  // succeeded but should not be trusted over it
  keepStored?: (stored: Response, fresh: Response) => boolean
}

// Serves the last good response while it is fresh, and falls back to it when
// the handler fails. Freshness comes from the response's own max-age, so
// GitHub is asked at most once per max-age per edge location, and an upstream
// failure only reaches the client if there has never been a good answer.
export function staleIfError(defaultMaxAge?: number, options: Options = {}) {
  return async (c: Context, next: Next) => {
    const cache = (globalThis as any).caches?.default
    if (!cache || !['GET', 'HEAD'].includes(c.req.method)) {
      await next()
      if (c.res.ok || c.res.status === 302) {
        if (defaultMaxAge !== undefined && !c.res.headers.has('Cache-Control')) {
          c.res.headers.set('Cache-Control', `public, max-age=${defaultMaxAge}`)
        }
        allowStale(c.res)
      }
      return
    }

    // HEAD and GET share an entry; firmware update checks are HEAD requests
    const key = new Request(c.req.url, { method: 'GET' })
    const stored: Response | undefined = await cache.match(key)
    if (stored) {
      const age = (Date.now() - Number(stored.headers.get(STORED_AT))) / 1000
      const maxAge = Number(stored.headers.get(ORIGINAL_CACHE_CONTROL)?.match(/max-age=(\d+)/)?.[1] ?? 0)
      if (age < maxAge) return restore(stored, false)
    }

    await next()

    if (c.res.status >= 500 || (stored && options.keepStored?.(stored, c.res))) {
      if (stored) {
        // Hono copies the headers of the response being replaced onto the new
        // one, which would carry the rejected Location over; clear it first
        c.res = undefined
        c.res = restore(stored, true)
      }
      return
    }
    if (defaultMaxAge !== undefined && !c.res.headers.has('Cache-Control')) {
      c.res.headers.set('Cache-Control', `public, max-age=${defaultMaxAge}`)
    }
    if (c.res.status === 200 || c.res.status === 302) {
      allowStale(c.res)
      const copy = new Response(c.res.clone().body, c.res)
      copy.headers.set(ORIGINAL_CACHE_CONTROL, c.res.headers.get('Cache-Control') ?? '')
      copy.headers.set('Cache-Control', `public, max-age=${KEEP_SECONDS}`)
      copy.headers.set(STORED_AT, String(Date.now()))
      await cache.put(key, copy)
      c.res.headers.set(CACHE_STATUS, 'MISS')
    }
  }
}
