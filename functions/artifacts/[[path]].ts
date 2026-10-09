import { Hono } from 'hono'
import type { Context } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { prettyJSON } from 'hono/pretty-json'
import { staleIfError } from '../../lib/stale-if-error.ts'
import { github } from '../../lib/github.ts'
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

interface Artifact {
  id: number
  name: string
}

function findAsset(rel: Artifact[], name: string): Artifact | null {
  return rel.find(artifact => artifact.name === name) ?? null
}

const app = new Hono().basePath('/artifacts')

// Anything unexpected here is an upstream problem (GitHub, nightly.link), so
// report it as a bad gateway rather than letting Hono answer 500.
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: "Upstream error" }, 502)
})
app.use("*", cors())

app.use('*', prettyJSON())

const runOf = (response: Response) => Number(response.headers.get('Location')?.match(/\/runs\/(\d+)\//)?.[1])

// GitHub's run listing occasionally answers with incomplete results: a branch
// with builds comes back empty, or an old run comes back as the newest. Run ids
// only grow, so an answer that is missing or older than the last one is wrong,
// and following it would send devices back to old firmware.
function isStaleListing(stored: Response, fresh: Response) {
  return fresh.status === 404 || runOf(fresh) < runOf(stored)
}

// Successful build runs for the firmware pickers (ESPresense-companion, the
// install page), so browsers stop spending their own 60/hour GitHub allowance.
// Same shape as GitHub's listing, trimmed to the fields the pickers read.
app.get('/runs',
  staleIfError(300),
  async (c: Context) => {
    const response = await github(c, 'actions/workflows/build.yml/runs?status=success&per_page=100', 300)
    if (!response.ok) {
      return c.json({ error: "Failed to fetch workflow runs", upstream: { status: response.status } }, 502)
    }

    const data: any = await response.json()
    return c.json({
      workflow_runs: data.workflow_runs.map((run: any) => ({
        id: run.id,
        name: run.name,
        head_branch: run.head_branch,
        head_sha: run.head_sha,
        status: run.status,
        conclusion: run.conclusion,
        created_at: run.created_at,
        updated_at: run.updated_at,
        html_url: run.html_url,
        head_commit: run.head_commit && { message: run.head_commit.message },
        head_repository: run.head_repository && { full_name: run.head_repository.full_name },
        pull_requests: (run.pull_requests ?? []).map((pr: any) => ({ number: pr.number }))
      }))
    })
  }
)

// Latest builds change frequently, cache GitHub API responses for 5 minutes
// Branch names can contain slashes (perf/some-experiment), so match the rest
// of the path and treat the last segment as the artifact name.
app.all('/latest/download/:rest{.+/[^/]+}',
  staleIfError(300, { keepStored: isStaleListing }),
  async (c: Context) => {
    const rest = c.req.param('rest')
    const branch = rest.substring(0, rest.lastIndexOf('/'))
    const bin = rest.substring(rest.lastIndexOf('/') + 1)
    console.log({ branch, bin })

    // Not filtered by status: the filtered listing is the one that has been
    // seen returning incomplete results
    const path = `actions/workflows/build.yml/runs?branch=${encodeURIComponent(branch)}&per_page=30`
    for (let page = 1; ; page++) {
      const response = await github(c, path + (page === 1 ? '' : `&page=${page}`), 300)

      if (!response.ok) {
        return c.json({ error: "Failed to fetch workflow runs", upstream: { status: response.status } }, response.status === 404 ? 404 : 502)
      }

      const data: any = await response.json()
      const firstRun = data.workflow_runs.find((run: any) => run.conclusion === 'success')
      if (firstRun) return c.redirect(`/artifacts/download/runs/${firstRun.id}/${bin}`)

      // Failed, cancelled and pending runs can fill a whole page. Only give
      // up once GitHub has no next page; keep requests on our fixed API path.
      if (!response.headers.get('Link')?.match(/;\s*rel="next"/)) return c.notFound()
    }
  }
)

// Same guard as the releases download route: route params can carry encoded
// separators that decode before interpolation, so keep bin to one plain segment.
const SAFE_SEGMENT = /^(?!\.+$)[A-Za-z0-9._-]+$/

// Specific run artifacts are immutable, cache for 24 hours
app.all('/download/runs/:run_id{[0-9]+}/:bin',
  staleIfError(86400),
  async (c: Context) => {
    const run_id = parseInt(c.req.param('run_id'))
    const bin = c.req.param('bin')
    console.log({ run_id, bin })
    if (!SAFE_SEGMENT.test(bin)) {
      return c.json({ error: "Invalid artifact name" }, 400)
    }
    const artifact = await fetch(`https://nightly.link/ESPresense/ESPresense/actions/runs/${run_id}/${bin}.zip`)
    if (artifact.status !== 200) {
      return c.json({ error: `Artifact not found: ${artifact.status}` }, artifact.status === 404 ? 404 : 502)
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
  staleIfError(86400),
  async (c: Context) => {
    const flavor = c.req.query('flavor')
    const run_id = parseInt(c.req.param('run_id_2'))
    console.log({ flavor, run_id })

    const response = await github(c, `actions/runs/${run_id}/artifacts`, 86400)

    if (!response.ok) {
      return c.json({ error: "Failed to fetch artifacts", upstream: { status: response.status } }, response.status === 404 ? 404 : 502)
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
    if (a32) manifest.builds.push(esp32(`download/runs/${run_id}/${a32.name}`))

    const c3 = findAsset(runArtifacts, `esp32c3-${flavor}.bin`) || findAsset(runArtifacts, `esp32c3.bin`)
    if (c3) manifest.builds.push(esp32c3(`download/runs/${run_id}/${c3.name}`, "uart"))

    const c3_cdc = findAsset(runArtifacts, `esp32c3-${flavor}-cdc.bin`) || findAsset(runArtifacts, `esp32c3-cdc.bin`)
    if (c3_cdc) manifest.builds.push(esp32c3(`download/runs/${run_id}/${c3_cdc.name}`, "cdc"))

    const s3 = findAsset(runArtifacts, `esp32s3-${flavor}.bin`) || findAsset(runArtifacts, `esp32s3.bin`)
    if (s3) manifest.builds.push(esp32s3(`download/runs/${run_id}/${s3.name}`, "uart"))

    const s3_cdc = findAsset(runArtifacts, `esp32s3-${flavor}-cdc.bin`) || findAsset(runArtifacts, `esp32s3-cdc.bin`)
    if (s3_cdc) manifest.builds.push(esp32s3(`download/runs/${run_id}/${s3_cdc.name}`, "cdc"))

    const c6 = findAsset(runArtifacts, `esp32c6-${flavor}.bin`) || findAsset(runArtifacts, `esp32c6.bin`)
    if (c6) manifest.builds.push(esp32c6(`download/runs/${run_id}/${c6.name}`, "uart"))

    const c6_cdc = findAsset(runArtifacts, `esp32c6-${flavor}-cdc.bin`) || findAsset(runArtifacts, `esp32c6-cdc.bin`)
    if (c6_cdc) manifest.builds.push(esp32c6(`download/runs/${run_id}/${c6_cdc.name}`, "cdc"))
    return c.json(manifest)
  }
)

export const onRequest = handle(app)
