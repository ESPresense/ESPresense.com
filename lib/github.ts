import type { Context } from 'hono'
import { retryOnce } from './retry-once.ts'

// The unauthenticated GitHub API allows 60 requests/hour per IP, shared with
// everything else behind Cloudflare's egress. With a GITHUB_TOKEN secret set on
// the Pages project the limit is 5,000/hour; without one this still works.
export async function github(c: Context, path: string, okTtl: number) {
  const token = c.env?.GITHUB_TOKEN
  const ask = () => fetch(`https://api.github.com/repos/ESPresense/ESPresense/${path}`, {
    headers: {
      "User-Agent": "espresense-artifact-proxy",
      ...(token && { "Authorization": `Bearer ${token}` })
    },
    cf: {
      // Only answers we act on are cached, so a refusal is never replayed
      cacheTtlByStatus: { '200-299': okTtl, '404': 60, '400-403': 0, '405-599': 0 }
    }
  } as any)

  return retryOnce(ask)
}
