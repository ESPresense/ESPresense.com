import type { Context, Next } from 'hono'
import { HEARTBEAT_MS, recall, remember } from './global-store.ts'

// How long a good answer is kept as a fallback for when the upstream fails
const KEEP_SECONDS = 7 * 24 * 60 * 60

const STORED_AT = 'X-Stored-At'
const ORIGINAL_CACHE_CONTROL = 'X-Original-Cache-Control'
// When this location last confirmed the global store holds this answer
const GLOBAL_AT = 'X-Global-At'
// HIT: fresh stored answer. MISS: upstream asked. STALE: upstream failed and
// this location's stored answer was used. STALE-GLOBAL: upstream failed and
// the answer came from the store shared by all locations.
const CACHE_STATUS = 'X-Release-Cache'

// Firmware images are megabytes and immutable; only redirects and manifests
// are worth sharing globally
const GLOBAL_MAX_BYTES = 64 * 1024

const BOOKKEEPING = [STORED_AT, ORIGINAL_CACHE_CONTROL, GLOBAL_AT]

function restore(stored: Response, status: 'HIT' | 'STALE' | 'STALE-GLOBAL') {
  const response = new Response(stored.body, stored)
  response.headers.set('Cache-Control', status === 'HIT' ? response.headers.get(ORIGINAL_CACHE_CONTROL) ?? 'no-store' : 'no-store')
  for (const header of BOOKKEEPING) response.headers.delete(header)
  response.headers.set(CACHE_STATUS, status)
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

// What is shared globally: enough to rebuild the response, nothing per-request
interface Answer {
  status: number
  location: string | null
  contentType: string | null
  body: string | null
}

async function answerOf(response: Response): Promise<Answer | null> {
  const contentType = response.headers.get('Content-Type')
  const textual = !contentType || /json|text/.test(contentType)
  const body = response.status === 302 ? null : textual ? await response.clone().text() : undefined
  if (body === undefined || (body?.length ?? 0) > GLOBAL_MAX_BYTES) return null
  return { status: response.status, location: response.headers.get('Location'), contentType, body }
}

function responseOf(answer: Answer) {
  const headers = new Headers({ 'Access-Control-Allow-Origin': '*' })
  if (answer.location) headers.set('Location', answer.location)
  if (answer.contentType) headers.set('Content-Type', answer.contentType)
  return new Response(answer.body, { status: answer.status, headers })
}

const same = (a: Answer | null, b: Answer | null) => JSON.stringify(a) === JSON.stringify(b)

interface Options {
  // Return true to keep serving the stored answer instead of a fresh one that
  // succeeded but should not be trusted over it
  keepStored?: (stored: Response, fresh: Response) => boolean
}

// Serves the last good response while it is fresh, and falls back to it when
// the handler fails. Freshness comes from the response's own max-age, so
// GitHub is asked at most once per max-age per edge location.
//
// The fallback is looked for in this location's cache first and then in the
// store shared by all locations, so an upstream failure only reaches the
// client if no location has ever had a good answer.
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
    const url = new URL(c.req.url)
    const key = new Request(url, { method: 'GET' })
    const globalKey = `response:${url.pathname}${url.search}`
    const stored: Response | undefined = await cache.match(key)
    if (stored) {
      const age = (Date.now() - Number(stored.headers.get(STORED_AT))) / 1000
      const maxAge = Number(stored.headers.get(ORIGINAL_CACHE_CONTROL)?.match(/max-age=(\d+)/)?.[1] ?? 0)
      if (age < maxAge) return restore(stored, 'HIT')
    }

    await next()

    const replace = (response: Response) => {
      // Hono copies the headers of the response being replaced onto the new
      // one, which would carry the rejected Location over; clear it first
      c.res = undefined
      c.res = response
    }

    const failed = c.res.status >= 500
    if (failed || (stored && options.keepStored?.(stored, c.res))) {
      if (stored) return replace(restore(stored, 'STALE'))
    }

    // This location has nothing of its own to compare with or fall back on, so
    // ask the shared store; a location that does never needs to
    const shared = !stored && (failed || options.keepStored) ? await recall<Answer>(c, globalKey) : undefined
    if (shared && (failed || options.keepStored?.(responseOf(shared.value), c.res))) {
      return replace(restore(responseOf(shared.value), 'STALE-GLOBAL'))
    }
    if (failed) return

    if (defaultMaxAge !== undefined && !c.res.headers.has('Cache-Control')) {
      c.res.headers.set('Cache-Control', `public, max-age=${defaultMaxAge}`)
    }
    if (c.res.status === 200 || c.res.status === 302) {
      allowStale(c.res)
      const copy = new Response(c.res.clone().body, c.res)
      copy.headers.set(ORIGINAL_CACHE_CONTROL, c.res.headers.get('Cache-Control') ?? '')
      copy.headers.set('Cache-Control', `public, max-age=${KEEP_SECONDS}`)
      copy.headers.set(STORED_AT, String(Date.now()))

      // Skip the shared store entirely while this location's own copy says the
      // answer is unchanged and was confirmed there recently
      const answer = await answerOf(c.res)
      if (answer) {
        const confirmedAt = Number(stored?.headers.get(GLOBAL_AT) ?? 0)
        const unchanged = stored && same(await answerOf(stored), answer)
        if (unchanged && Date.now() - confirmedAt < HEARTBEAT_MS) {
          copy.headers.set(GLOBAL_AT, String(confirmedAt))
        } else if (await remember(c, globalKey, answer, shared)) {
          copy.headers.set(GLOBAL_AT, String(Date.now()))
        }
      }

      await cache.put(key, copy)
      c.res.headers.set(CACHE_STATUS, 'MISS')
    }
  }
}
