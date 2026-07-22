import { Hono } from 'hono'
import type { Context } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { prettyJSON } from 'hono/pretty-json'
import { cors } from 'hono/cors'

function esp32(path: string) {
  return {
    "chipFamily": "ESP32",
    "parts": [{
      "path": "/static/esp32/bootloader.bin",
      "offset": 4096
    },
    {
      "path": "/static/esp32/partitions.bin",
      "offset": 32768
    },
    {
      "path": "/static/boot_app0.bin",
      "offset": 57344
    },
    {
      "path": path,
      "offset": 65536
    }]
  }
}

function esp32c3(path: string, serialType?: "cdc" | "uart") {
  return {
    "chipFamily": "ESP32-C3",
    ...(serialType && { serialType }),
    "parts": [{
      "path": "/static/esp32c3/bootloader.bin",
      "offset": 0x0000
    },
    {
      "path": "/static/esp32c3/partitions.bin",
      "offset": 0x8000
    },
    {
      "path": "/static/boot_app0.bin",
      "offset": 0xe000
    },
    {
      "path": path,
      "offset": 0x10000
    }]
  }
}

function esp32s3(path: string, serialType?: "cdc" | "uart") {
  return {
    "chipFamily": "ESP32-S3",
    ...(serialType && { serialType }),
    "parts": [{
      "path": "/static/esp32s3/bootloader.bin",
      "offset": 0x0000
    },
    {
      "path": "/static/esp32s3/partitions.bin",
      "offset": 0x8000
    },
    {
      "path": "/static/boot_app0.bin",
      "offset": 0xe000
    },
    {
      "path": path,
      "offset": 0x10000
    }]
  }
}

function esp32c6(path: string, serialType?: "cdc" | "uart") {
  return {
    "chipFamily": "ESP32-C6",
    ...(serialType && { serialType }),
    "parts": [{
      "path": "/static/esp32c6/bootloader.bin",
      "offset": 0x0000
    },
    {
      "path": "/static/esp32c6/partitions.bin",
      "offset": 0x8000
    },
    {
      "path": "/static/boot_app0.bin",
      "offset": 0xe000
    },
    {
      "path": path,
      "offset": 0x10000
    }]
  }
}

interface Asset {
  name: string
  browser_download_url: string
}

interface Release {
  name: string
  tag_name: string
  assets: Asset[]
}

function findAsset(rel: Release, name: string): Asset | null {
  return rel.assets.find(asset => asset.name === name) ?? null
}

const app = new Hono().basePath('/releases')

// Anything unexpected here is an upstream problem (GitHub, nightly.link), so
// report it as a bad gateway rather than letting Hono answer 500.
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: "Upstream error" }, 502)
})
app.use("*", cors())

app.use('*', prettyJSON())

// Route params can carry encoded separators that decode before interpolation,
// so anything placed in an upstream URL must be one plain segment.
// Rejects bare dot segments ("." / "..") too, which would otherwise survive
// this character class and be collapsed by URL normalization.
const SAFE_SEGMENT = /^(?!\.+$)[A-Za-z0-9._-]+$/

// Release manifests: latest = 5 min, specific releases = 1 day
app.get('/:tag{[^/]+\\.json}',
  async (c: Context) => {
    const fname = c.req.param('tag')
    const tag = fname.substring(0, fname.lastIndexOf('.'))
    const flavor = c.req.query('flavor')
    if (!SAFE_SEGMENT.test(tag)) {
      return c.json({ error: "Invalid tag" }, 400)
    }

    // latest changes frequently, specific releases are immutable
    const maxAge = tag === 'latest' ? 300 : 86400

    // 'latest' is not a real Git tag; GitHub's /releases/latest resolves it
    // to the newest non-prerelease. Specific tags use /releases/tags/{tag}.
    const releasePath = tag === 'latest' ? 'releases/latest' : `releases/tags/${tag}`
    const response = await fetch(`https://api.github.com/repos/ESPresense/ESPresense/${releasePath}`, {
      headers: { "User-Agent": "espresense-release-proxy" },
      cf: {
        cacheTtlByStatus: { '200-299': 300, '400-499': 60, '500-599': 0 }
      }
    } as any)

    if (!response.ok) {
      return c.json({ error: "Release not found" }, response.status === 404 ? 404 : 502)
    }

    const rel: Release = await response.json()
    // Binary paths must point at the resolved release's real tag (e.g. v4.0.6),
    // not the literal 'latest' token which has no GitHub download URL.
    const realTag = rel.tag_name || tag

    const manifest = {
      "name": "ESPresense " + rel.name + (flavor && flavor !== "" ? ` (${flavor})` : ""),
      "version": rel.name,
      "new_install_prompt_erase": true,
      "builds": [] as any[]
    }

    const a32 = findAsset(rel, `esp32-${flavor}.bin`) || findAsset(rel, `${flavor}.bin`) || findAsset(rel, `esp32.bin`)
    if (a32) manifest.builds.push(esp32(`download/${realTag}/${a32.name}`))

    const c3 = findAsset(rel, `esp32c3-${flavor}.bin`) || findAsset(rel, `esp32c3.bin`)
    if (c3) manifest.builds.push(esp32c3(`download/${realTag}/${c3.name}`, "uart"))

    const c3_cdc = findAsset(rel, `esp32c3-${flavor}-cdc.bin`) || findAsset(rel, `esp32c3-cdc.bin`)
    if (c3_cdc) manifest.builds.push(esp32c3(`download/${realTag}/${c3_cdc.name}`, "cdc"))

    const s3 = findAsset(rel, `esp32s3-${flavor}.bin`) || findAsset(rel, `esp32s3.bin`)
    if (s3) manifest.builds.push(esp32s3(`download/${realTag}/${s3.name}`, "uart"))

    const s3_cdc = findAsset(rel, `esp32s3-${flavor}-cdc.bin`) || findAsset(rel, `esp32s3-cdc.bin`)
    if (s3_cdc) manifest.builds.push(esp32s3(`download/${realTag}/${s3_cdc.name}`, "cdc"))

    const c6 = findAsset(rel, `esp32c6-${flavor}.bin`) || findAsset(rel, `esp32c6.bin`)
    if (c6) manifest.builds.push(esp32c6(`download/${realTag}/${c6.name}`, "uart"))

    const c6_cdc = findAsset(rel, `esp32c6-${flavor}-cdc.bin`) || findAsset(rel, `esp32c6-cdc.bin`)
    if (c6_cdc) manifest.builds.push(esp32c6(`download/${realTag}/${c6_cdc.name}`, "cdc"))

    c.header('Cache-Control', `public, max-age=${maxAge}`)
    return c.json(manifest)
  }
)

// Release downloads: latest = 5 min, specific releases = 1 day
app.get('/download/:tag/:filename',
  async (c: Context) => {
    const tag = c.req.param('tag')
    const filename = c.req.param('filename')

    // Reject anything that isn't a plain filename/tag segment to prevent
    // path traversal or URL manipulation via encoded '/', '..', etc.
    if (!SAFE_SEGMENT.test(tag) || !SAFE_SEGMENT.test(filename)) {
      return c.json({ error: "Invalid tag or filename" }, 400)
    }

    // latest changes frequently, specific releases are immutable
    const maxAge = tag === 'latest' ? 300 : 86400

    const githubUrl = `https://github.com/ESPresense/ESPresense/releases/download/${tag}/${filename}`
    const response = await fetch(githubUrl, {
      cf: {
        cacheTtlByStatus: { '200-299': 300, '400-499': 60, '500-599': 0 }
      }
    } as any)

    if (!response.ok) {
      return c.json({ error: "Asset not found" }, response.status === 404 ? 404 : 502)
    }

    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': `public, max-age=${maxAge}`
      }
    })
  }
)

const GITHUB = 'https://github.com/ESPresense/ESPresense'

// Release lookups go through github.com's own redirects and the releases feed
// rather than api.github.com: the unauthenticated API allows 60 requests/hour
// per IP, which update checks from devices in the field exhaust.
function lookup(url: string) {
  return fetch(url, {
    redirect: 'manual',
    headers: { "User-Agent": "espresense-release-proxy" },
    cf: {
      cacheTtlByStatus: { '200-399': 300, '400-499': 60, '500-599': 0 }
    }
  } as any)
}

// IMPORTANT: Must redirect, not proxy!
// ESP32 firmware checks for updates by sending HEAD requests and expects a 3xx redirect.
// It compares the Location header against a version marker to detect new versions,
// so Location must be the tagged releases/download URL, never a "latest" alias
// or a signed asset URL. See Updater::checkForUpdates() in the ESPresense firmware.
function firmwareRedirect(c: Context, location: string) {
  const redirectResponse = c.redirect(location)
  redirectResponse.headers.set('Cache-Control', 'public, max-age=300')
  return redirectResponse
}

// Latest stable release (excludes prereleases), cache for 5 minutes
app.get('/latest/download/:filename',
  async (c: Context) => {
    const filename = c.req.param('filename')
    if (!SAFE_SEGMENT.test(filename)) {
      return c.json({ error: "Invalid filename" }, 400)
    }

    // GitHub's releases/latest alias excludes prereleases and redirects to the tagged URL
    const response = await lookup(`${GITHUB}/releases/latest/download/${filename}`)
    const location = response.headers.get('Location')
    if (response.status !== 302 || !location?.startsWith(`${GITHUB}/releases/download/`)) {
      return c.json({ error: "Release lookup failed" }, 502)
    }

    // The alias redirects whether or not the file exists, so check the tagged URL
    const asset = await lookup(location)
    if (asset.status === 404) {
      return c.json({ error: "No asset found" }, 404)
    }
    if (asset.status !== 302) {
      return c.json({ error: "Release lookup failed" }, 502)
    }
    return firmwareRedirect(c, location)
  }
)

// How many of the newest releases to probe for the requested asset
const LATEST_ANY_DEPTH = 3

// Latest release including prereleases, cache for 5 minutes
app.get('/latest-any/download/:filename',
  async (c: Context) => {
    const filename = c.req.param('filename')
    if (!SAFE_SEGMENT.test(filename)) {
      return c.json({ error: "Invalid filename" }, 400)
    }

    const feed = await lookup(`${GITHUB}/releases.atom`)
    if (!feed.ok) {
      return c.json({ error: "Release lookup failed" }, 502)
    }

    // Feed is newest first and includes prereleases
    const tags = [...(await feed.text()).matchAll(/\/releases\/tag\/([^"<\s]+)/g)]
      .map(m => decodeURIComponent(m[1]))
      .filter((tag, i, all) => SAFE_SEGMENT.test(tag) && all.indexOf(tag) === i)
      .slice(0, LATEST_ANY_DEPTH)

    // A release can be published before its assets are uploaded, so take the
    // newest one that actually has this file
    for (const tag of tags) {
      const url = `${GITHUB}/releases/download/${tag}/${filename}`
      const response = await lookup(url)
      if (response.status === 302) return firmwareRedirect(c, url)
      if (response.status !== 404) {
        return c.json({ error: "Release lookup failed" }, 502)
      }
    }
    return c.json({ error: "No asset found" }, 404)
  }
)

export const onRequest = handle(app)
