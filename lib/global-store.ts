import type { Context } from 'hono'

// A KV namespace bound as RELEASES, shared by every edge location. Optional:
// without the binding everything here is a no-op and each location relies on
// its own cache, as before.
//
// KV's free tier allows 1,000 writes and 100,000 reads a day, against roughly
// 33,000 Function invocations. So KV is not the freshness clock. It holds the
// last good answer, is written only when that answer changes or on a slow
// heartbeat, and is read only when a location cannot answer from its own cache.

// How long an unchanged record goes before it is rewritten to keep it alive
export const HEARTBEAT_MS = 6 * 60 * 60 * 1000

// How long a record survives without being rewritten
const KEEP_SECONDS = 30 * 24 * 60 * 60

interface Record<T> {
  value: T
  storedAt: number
}

const namespace = (c: Context) => (c.env as any)?.RELEASES

// A failed read or write must never fail the request: over quota, KV refuses
export async function recall<T>(c: Context, key: string): Promise<Record<T> | null> {
  try {
    return (await namespace(c)?.get(key, 'json')) ?? null
  } catch (err) {
    console.error(`global store read failed: ${key}`, err)
    return null
  }
}

// Writes only when the value changed or the record is due a heartbeat, and
// returns whether the store now holds this value
export async function remember<T>(c: Context, key: string, value: T, known?: Record<T> | null): Promise<boolean> {
  const store = namespace(c)
  if (!store) return false

  const existing = known === undefined ? await recall<T>(c, key) : known
  const unchanged = existing && JSON.stringify(existing.value) === JSON.stringify(value)
  if (unchanged && Date.now() - existing.storedAt < HEARTBEAT_MS) return true

  try {
    await store.put(key, JSON.stringify({ value, storedAt: Date.now() }), { expirationTtl: KEEP_SECONDS })
    return true
  } catch (err) {
    console.error(`global store write failed: ${key}`, err)
    return false
  }
}
