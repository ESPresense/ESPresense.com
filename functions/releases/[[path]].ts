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

function esp32c3(path: string) {
  return {
    "chipFamily": "ESP32-C3",
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

function esp32s3(path: string) {
  return {
    "chipFamily": "ESP32-S3",
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

interface Asset {
  name: string
  browser_download_url: string
}

interface Release {
  name: string
  assets: Asset[]
}

function findAsset(rel: Release, name: string): Asset | null {
  return rel.assets.find(asset => asset.name === name) ?? null
}

const app = new Hono().basePath('/releases')
app.use("*", cors())

app.use('*', prettyJSON())

// Release manifests: latest = 5 min, specific releases = 1 day
app.get('/:tag{[^/]+\\.json}',
  async (c: Context) => {
    const fname = c.req.param('tag')
    const tag = fname.substring(0, fname.lastIndexOf('.'))
    const flavor = c.req.query('flavor')

    // latest changes frequently, specific releases are immutable
    const maxAge = tag === 'latest' ? 300 : 86400

    const response = await fetch(`https://api.github.com/repos/ESPresense/ESPresense/releases/tags/${tag}`, {
      headers: { "User-Agent": "espresense-release-proxy" },
      cf: {
        cacheTtlByStatus: { '200-299': 300, '400-499': 60, '500-599': 0 }
      }
    } as any)

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(`GitHub API returned 403 when fetching release ${tag}`)
      }
      return c.json({ error: "Release not found" }, response.status as any)
    }

    const rel: Release = await response.json()

    const manifest = {
      "name": "ESPresense " + rel.name + (flavor && flavor !== "" ? ` (${flavor})` : ""),
      "version": rel.name,
      "new_install_prompt_erase": true,
      "builds": [] as any[]
    }

    const a32 = findAsset(rel, `esp32-${flavor}.bin`) || findAsset(rel, `${flavor}.bin`) || findAsset(rel, `esp32.bin`)
    if (a32) manifest.builds.push(esp32(`download/${tag}/${a32.name}`))

    const c3 = findAsset(rel, `esp32c3-${flavor}.bin`) || findAsset(rel, `esp32c3.bin`)
    if (c3) manifest.builds.push(esp32c3(`download/${tag}/${c3.name}`))

    const s3 = findAsset(rel, `esp32s3-${flavor}.bin`) || findAsset(rel, `esp32s3.bin`)
    if (s3) manifest.builds.push(esp32s3(`download/${tag}/${s3.name}`))

    c.header('Cache-Control', `public, max-age=${maxAge}`)
    return c.json(manifest)
  }
)

// Release downloads: latest = 5 min, specific releases = 1 day
app.get('/download/:tag/:filename',
  async (c: Context) => {
    const tag = c.req.param('tag')
    const filename = c.req.param('filename')

    // latest changes frequently, specific releases are immutable
    const maxAge = tag === 'latest' ? 300 : 86400

    const githubUrl = `https://github.com/ESPresense/ESPresense/releases/download/${tag}/${filename}`
    const response = await fetch(githubUrl, {
      cf: {
        cacheTtlByStatus: { '200-299': 300, '400-499': 60, '500-599': 0 }
      }
    } as any)

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

// Latest stable release (excludes prereleases), cache for 5 minutes
app.get('/latest/download/:filename',
  async (c: Context) => {
    const filename = c.req.param('filename')

    // GitHub's /releases/latest endpoint excludes prereleases
    const response = await fetch("https://api.github.com/repos/ESPresense/ESPresense/releases/latest", {
      headers: { "User-Agent": "espresense-release-proxy" },
      cf: {
        cacheTtlByStatus: { '200-299': 300, '400-499': 60, '500-599': 0 }
      }
    } as any)

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(`GitHub API returned 403 when fetching latest release`)
      }
      return c.json({ error: "No release found" }, response.status as any)
    }

    const rel: Release = await response.json()

    const asset = rel.assets.find(a => a.name === filename)
    if (!asset) {
      return c.json({ error: "No asset found" }, 404)
    }

    // IMPORTANT: Must redirect, not proxy!
    // ESP32 firmware checks for updates by sending HEAD requests and expects a 3xx redirect.
    // It compares the Location header against a version marker to detect new versions.
    // See Updater::checkForUpdates() in the ESPresense firmware.
    const redirectResponse = c.redirect(asset.browser_download_url)
    redirectResponse.headers.set('Cache-Control', 'public, max-age=300')
    return redirectResponse
  }
)

// Latest release including prereleases, cache for 5 minutes
app.get('/latest-any/download/:filename',
  async (c: Context) => {
    const filename = c.req.param('filename')

    const response = await fetch("https://api.github.com/repos/ESPresense/ESPresense/releases", {
      headers: { "User-Agent": "espresense-release-proxy" },
      cf: {
        cacheTtlByStatus: { '200-299': 300, '400-499': 60, '500-599': 0 }
      }
    } as any)

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(`GitHub API returned 403 when fetching releases`)
      }
      return c.json({ error: "No releases found" }, response.status as any)
    }

    const releases: Release[] = await response.json()
    const rel = releases.find(r => r.assets.length)

    if (!rel) {
      return c.json({ error: "No release found" }, 404)
    }

    const asset = rel.assets.find(a => a.name === filename)
    if (!asset) {
      return c.json({ error: "No asset found" }, 404)
    }

    // IMPORTANT: Must redirect, not proxy!
    // ESP32 firmware checks for updates by sending HEAD requests and expects a 3xx redirect.
    // It compares the Location header against a version marker to detect new versions.
    // See Updater::checkForUpdates() in the ESPresense firmware.
    const redirectResponse = c.redirect(asset.browser_download_url)
    redirectResponse.headers.set('Cache-Control', 'public, max-age=300')
    return redirectResponse
  }
)

export const onRequest = handle(app)
