import { Hono } from 'hono'
import type { Context } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { prettyJSON } from 'hono/pretty-json'
import { cache } from 'hono/cache'
import { cors } from 'hono/cors'
import * as fflate from "fflate"

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

function esp32c6(path: string) {
  return {
    "chipFamily": "ESP32-C6",
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

interface Artifact {
  id: number
  name: string
}

function findAsset(rel: Artifact[], name: string): Artifact | null {
  return rel.find(artifact => artifact.name === name) ?? null
}

const app = new Hono().basePath('/artifacts')
app.use("*", cors())

app.use('*', prettyJSON())

// Latest builds change frequently, cache GitHub API responses for 5 minutes
app.all('/latest/download/:branch/:bin',
  cache({ cacheName: 'artifacts', cacheControl: 'public, max-age=300' }),
  async (c: Context) => {
    const branch = c.req.param('branch')
    const bin = c.req.param('bin')
    console.log({ branch, bin })

    const response = await fetch(
      `https://api.github.com/repos/ESPresense/ESPresense/actions/workflows/build.yml/runs?status=success&branch=${branch}`,
      {
        headers: { "User-Agent": "espresense-artifact-proxy" },
        cf: {
          cacheTtlByStatus: { '200-299': 300, '400-499': 60, '500-599': 0 }
        }
      } as any
    )

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(`GitHub API returned 403 when fetching workflow runs for ${branch}`)
      }
      return c.json({ error: "Failed to fetch workflow runs" }, response.status as any)
    }

    const data: any = await response.json()
    const firstRun = data.workflow_runs[0]
    if (!firstRun) return c.notFound()
    const run_id = firstRun.id
    const sha = firstRun.head_sha
    return c.redirect(`/artifacts/download/runs/${run_id}/${sha.substring(0, 7)}/${bin}`)
  }
)

// Specific run artifacts are immutable, cache GitHub API responses for 24 hours
app.all('/download/runs/:run_id/:sha/:bin',
  cache({ cacheName: 'artifacts', cacheControl: 'public, max-age=86400' }),
  async (c: Context) => {
    const run_id = parseInt(c.req.param('run_id'))
    const bin = c.req.param('bin')
    console.log({ run_id })

    const response = await fetch(
      `https://api.github.com/repos/ESPresense/ESPresense/actions/runs/${run_id}/artifacts`,
      {
        headers: { "User-Agent": "espresense-artifact-proxy" },
        cf: {
          cacheTtlByStatus: { '200-299': 86400, '400-499': 60, '500-599': 0 }
        }
      } as any
    )

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(`GitHub API returned 403 when fetching artifacts for run ${run_id}`)
      }
      return c.json({ error: "Failed to fetch artifacts" }, response.status as any)
    }

    const data: any = await response.json()
    let artifacts = data.artifacts
    const artifact = findAsset(artifacts, bin)
    if (!artifact) return c.notFound()
    return c.redirect(`/artifacts/download/${artifact.id}/${bin}`)
  }
)

// Artifact downloads by ID are immutable, cache for 7 days
app.get('/download/:artifact_id/*',
  cache({ cacheName: 'artifacts', cacheControl: 'public, max-age=604800' }),
  async (c: Context) => {
    const artifact_id = parseInt(c.req.param('artifact_id'))
    console.log({ artifact_id })
    const artifact = await fetch(`https://nightly.link/ESPresense/ESPresense/actions/artifacts/${artifact_id}.zip`)
    if (artifact.status !== 200) {
      return c.json({ error: `Artifact not found: ${artifact.status}` }, artifact.status as any)
    }
    const ab = await artifact.arrayBuffer()
    const arr = new Uint8Array(ab)
    const files = fflate.unzipSync(arr)
    for (const key in files) {
      if (Object.prototype.hasOwnProperty.call(files, key)) {
        const fileData = files[key]
        return new Response(fileData as any, { status: 200, headers: { 'Content-Type': 'application/octet-stream' } })
      }
    }
    return c.notFound()
  }
)

// Manifests for specific runs are immutable, cache GitHub API responses for 24 hours
app.get('/:run_id_2{[0-9]+.json}',
  cache({ cacheName: 'artifacts', cacheControl: 'public, max-age=86400' }),
  async (c: Context) => {
    const flavor = c.req.query('flavor')
    const run_id = parseInt(c.req.param('run_id_2'))
    console.log({ flavor, run_id })

    const response = await fetch(
      `https://api.github.com/repos/ESPresense/ESPresense/actions/runs/${run_id}/artifacts`,
      {
        headers: { "User-Agent": "espresense-artifact-proxy" },
        cf: {
          cacheTtlByStatus: { '200-299': 86400, '400-499': 60, '500-599': 0 }
        }
      } as any
    )

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(`GitHub API returned 403 when fetching artifacts for manifest ${run_id}`)
      }
      return c.json({ error: "Failed to fetch artifacts" }, response.status as any)
    }

    const data: any = await response.json()
    const runArtifacts = data.artifacts
    if (runArtifacts.length === 0) return c.notFound()
    const workflow_run = runArtifacts[0].workflow_run
    if (!workflow_run) return c.json({ error: "No workflow run found" }, 404)

    const shortSha = workflow_run.head_sha ? workflow_run.head_sha.substring(0, 7) : "unknown"
    const manifest: any = {
      "name": "ESPresense " + workflow_run.head_branch + " branch" + (flavor && flavor !== "" ? ` (${flavor})` : ""),
      "version": `${workflow_run.head_branch}-${shortSha}`,
      "new_install_prompt_erase": true,
      "builds": []
    }
    const a32 = findAsset(runArtifacts, `esp32-${flavor}.bin`) || findAsset(runArtifacts, `${flavor}.bin`) || findAsset(runArtifacts, `esp32.bin`)
    if (a32) manifest.builds.push(esp32(`download/${a32.id}/${a32.name}`))

    const c3 = findAsset(runArtifacts, `esp32c3-${flavor}.bin`) || findAsset(runArtifacts, `esp32c3.bin`)
    if (c3) manifest.builds.push(esp32c3(`download/${c3.id}/${c3.name}`))

    const s3 = findAsset(runArtifacts, `esp32s3-${flavor}.bin`) || findAsset(runArtifacts, `esp32s3.bin`)
    if (s3) manifest.builds.push(esp32s3(`download/${s3.id}/${s3.name}`))

    const c6 = findAsset(runArtifacts, `esp32c6-${flavor}.bin`) || findAsset(runArtifacts, `esp32c6.bin`)
    if (c6) manifest.builds.push(esp32c6(`download/${c6.id}/${c6.name}`))
    return c.json(manifest)
  }
)

export const onRequest = handle(app)
