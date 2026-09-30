// Route tests for the Pages Functions, with GitHub stubbed out.
import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { onRequest as releases } from '../functions/releases/[[path]].ts'
import { onRequest as artifacts } from '../functions/artifacts/[[path]].ts'

const GITHUB = 'https://github.com/ESPresense/ESPresense'
const feed = (...tags) => tags.map(t => `<link rel="alternate" href="${GITHUB}/releases/tag/${t}"/>`).join('\n')
const redirect = (location) => new Response(null, { status: 302, headers: { Location: location } })

let upstream, fetched, sent
beforeEach(() => {
  upstream = {}
  fetched = []
  sent = []
  globalThis.fetch = async (url, init) => {
    fetched.push(String(url))
    sent.push({ url: String(url), headers: new Headers(init?.headers) })
    const reply = upstream[String(url)]
    return reply ? reply() : new Response('not found', { status: 404 })
  }
})

const get = (handler, path) => handler({
  request: new Request('https://espresense.com' + path),
  env: {}, params: {}, waitUntil() {}, passThroughOnException() {},
  next: () => new Response(null, { status: 404 }),
})

test('latest redirects to the tagged release URL', async () => {
  const tagged = `${GITHUB}/releases/download/v4.0.6/esp32.bin`
  upstream[`${GITHUB}/releases/latest/download/esp32.bin`] = () => redirect(tagged)
  upstream[tagged] = () => redirect('https://release-assets.example/signed')

  const res = await get(releases, '/releases/latest/download/esp32.bin')
  assert.equal(res.status, 302)
  assert.equal(res.headers.get('Location'), tagged)
  assert.equal(res.headers.get('Cache-Control'), 'public, max-age=300, stale-while-revalidate=86400, stale-if-error=86400')
})

test('latest returns 404 when the release lacks the file', async () => {
  // GitHub's alias redirects even for files that do not exist
  upstream[`${GITHUB}/releases/latest/download/nope.bin`] = () => redirect(`${GITHUB}/releases/download/v4.0.6/nope.bin`)
  assert.equal((await get(releases, '/releases/latest/download/nope.bin')).status, 404)
})

test('latest returns 502 when GitHub refuses the lookup', async () => {
  upstream[`${GITHUB}/releases/latest/download/esp32.bin`] = () => new Response('slow down', { status: 429 })
  assert.equal((await get(releases, '/releases/latest/download/esp32.bin')).status, 502)
})

test('latest-any picks the newest release that has the file', async () => {
  const tagged = `${GITHUB}/releases/download/v4.1.0b0/esp32.bin`
  upstream[`${GITHUB}/releases.atom`] = () => new Response(feed('v5.0.0-b.0', 'v4.1.0b0', 'v4.0.6'))
  upstream[tagged] = () => redirect('https://release-assets.example/signed')
  upstream[`${GITHUB}/releases/download/v4.0.6/esp32.bin`] = () => redirect('https://release-assets.example/older')

  const res = await get(releases, '/releases/latest-any/download/esp32.bin')
  assert.equal(res.status, 302)
  assert.equal(res.headers.get('Location'), tagged)
})

test('latest-any returns 404 when no recent release has the file', async () => {
  upstream[`${GITHUB}/releases.atom`] = () => new Response(feed('v4.1.0b0', 'v4.0.6'))
  assert.equal((await get(releases, '/releases/latest-any/download/nope.bin')).status, 404)
})

test('latest-any returns 502 when the feed is unavailable', async () => {
  upstream[`${GITHUB}/releases.atom`] = () => new Response('slow down', { status: 429 })
  assert.equal((await get(releases, '/releases/latest-any/download/esp32.bin')).status, 502)
})

test('latest-any ignores unsafe tags in the feed', async () => {
  upstream[`${GITHUB}/releases.atom`] = () => new Response(feed('..%2F..%2Fevil', 'v4.0.6'))
  upstream[`${GITHUB}/releases/download/v4.0.6/esp32.bin`] = () => redirect('https://release-assets.example/signed')

  const res = await get(releases, '/releases/latest-any/download/esp32.bin')
  assert.equal(res.headers.get('Location'), `${GITHUB}/releases/download/v4.0.6/esp32.bin`)
  assert.ok(fetched.every(url => !url.includes('evil')))
})

test('latest routes never call the rate-limited GitHub API', async () => {
  upstream[`${GITHUB}/releases.atom`] = () => new Response(feed('v4.0.6'))
  await get(releases, '/releases/latest/download/esp32.bin')
  await get(releases, '/releases/latest-any/download/esp32.bin')
  assert.ok(fetched.length > 0)
  assert.ok(fetched.every(url => !url.includes('api.github.com')), fetched.join('\n'))
})

for (const path of [
  '/releases/latest/download/a%2F..%2Fb',
  '/releases/latest-any/download/a%2F..%2Fb',
  '/releases/download/v4.0.6/a%2F..%2Fb',
  '/releases/download/v4.0.6%2F..%2F..%2F..%2Fattacker%2Frepo/evil.html',
]) {
  test(`rejects encoded separators without fetching: ${path}`, async () => {
    assert.equal((await get(releases, path)).status, 400)
    assert.deepEqual(fetched, [])
  })
}

test('artifacts rejects encoded separators in the artifact name', async () => {
  assert.equal((await get(artifacts, '/artifacts/download/runs/123/a%2F..%2Fb')).status, 400)
  assert.deepEqual(fetched, [])
})

test('artifacts does not route a run id with a numeric prefix', async () => {
  assert.equal((await get(artifacts, '/artifacts/download/runs/123abc/esp32.bin')).status, 404)
  assert.deepEqual(fetched, [])
})

// --- releases: manifest and tagged download ---------------------------------

const API = 'https://api.github.com/repos/ESPresense/ESPresense'
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
const appPaths = (manifest) => manifest.builds.map(b => `${b.chipFamily}${b.serialType ? ':' + b.serialType : ''} ${b.parts.at(-1).path}`)

const release = (tag, ...names) => {
  for (const name of names) upstream[`${GITHUB}/releases/download/${tag}/${name}`] = () => redirect('https://release-assets.example/signed')
}

test('release manifest lists a build per chip family', async () => {
  release('v4.0.6', 'esp32.bin', 'esp32c3.bin', 'esp32c3-cdc.bin', 'esp32s3.bin', 'esp32s3-cdc.bin', 'esp32c6.bin', 'esp32c6-cdc.bin')

  const res = await get(releases, '/releases/v4.0.6.json')
  assert.equal(res.status, 200)
  assert.equal(res.headers.get('Cache-Control'), 'public, max-age=86400, stale-while-revalidate=86400, stale-if-error=86400')
  const manifest = await res.json()
  assert.equal(manifest.name, 'ESPresense v4.0.6')
  assert.equal(manifest.version, 'v4.0.6')
  assert.equal(manifest.new_install_prompt_erase, true)
  assert.deepEqual(appPaths(manifest), [
    'ESP32 download/v4.0.6/esp32.bin',
    'ESP32-C3:uart download/v4.0.6/esp32c3.bin',
    'ESP32-C3:cdc download/v4.0.6/esp32c3-cdc.bin',
    'ESP32-S3:uart download/v4.0.6/esp32s3.bin',
    'ESP32-S3:cdc download/v4.0.6/esp32s3-cdc.bin',
    'ESP32-C6:uart download/v4.0.6/esp32c6.bin',
    'ESP32-C6:cdc download/v4.0.6/esp32c6-cdc.bin',
  ])
  // The app image is always the last part, flashed at the app offset
  assert.deepEqual(manifest.builds.map(b => b.parts.at(-1).offset), [0x10000, 0x10000, 0x10000, 0x10000, 0x10000, 0x10000, 0x10000])
})

test('release manifest prefers flavored assets and falls back per chip', async () => {
  release('v4.0.6', 'esp32.bin', 'esp32-verbose.bin', 'esp32c3.bin', 'm5atom.bin')

  const verbose = await (await get(releases, '/releases/v4.0.6.json?flavor=verbose')).json()
  assert.equal(verbose.name, 'ESPresense v4.0.6 (verbose)')
  assert.deepEqual(appPaths(verbose), ['ESP32 download/v4.0.6/esp32-verbose.bin', 'ESP32-C3:uart download/v4.0.6/esp32c3.bin'])

  // Board flavors are published as <flavor>.bin
  const m5 = await (await get(releases, '/releases/v4.0.6.json?flavor=m5atom')).json()
  assert.equal(appPaths(m5)[0], 'ESP32 download/v4.0.6/m5atom.bin')
})

test('release manifest omits chip families the release does not ship', async () => {
  release('v3.0.0', 'esp32.bin')
  assert.deepEqual(appPaths(await (await get(releases, '/releases/v3.0.0.json')).json()), ['ESP32 download/v3.0.0/esp32.bin'])
})

test('latest.json resolves to the newest stable release and its real tag', async () => {
  upstream[`${GITHUB}/releases/latest`] = () => redirect(`${GITHUB}/releases/tag/v4.0.6`)
  release('v4.0.6', 'esp32.bin', 'esp32c3.bin')

  const res = await get(releases, '/releases/latest.json')
  assert.equal(res.status, 200)
  assert.equal(res.headers.get('Cache-Control'), 'public, max-age=300, stale-while-revalidate=86400, stale-if-error=86400')
  const manifest = await res.json()
  assert.equal(manifest.version, 'v4.0.6')
  // 'latest' is not a tag, so download paths must use the resolved one
  assert.deepEqual(appPaths(manifest), ['ESP32 download/v4.0.6/esp32.bin', 'ESP32-C3:uart download/v4.0.6/esp32c3.bin'])
})

test('latest.json returns 502 when the alias does not resolve', async () => {
  upstream[`${GITHUB}/releases/latest`] = () => new Response('slow down', { status: 429 })
  const res = await get(releases, '/releases/latest.json')
  assert.equal(res.status, 502)
  assert.deepEqual((await res.json()).upstream, { url: `${GITHUB}/releases/latest`, status: 429 })
})

test('release manifest returns 404 for an unknown tag', async () => {
  assert.equal((await get(releases, '/releases/v0.0.0.json')).status, 404)
})

test('release manifest returns 502 and names the lookup GitHub refused', async () => {
  release('v4.0.6', 'esp32.bin')
  upstream[`${GITHUB}/releases/download/v4.0.6/esp32c3.bin`] = () => new Response('slow down', { status: 429 })

  const res = await get(releases, '/releases/v4.0.6.json')
  assert.equal(res.status, 502)
  assert.deepEqual((await res.json()).upstream, { url: `${GITHUB}/releases/download/v4.0.6/esp32c3.bin`, status: 429 })
})

test('release manifest never calls the rate-limited GitHub API', async () => {
  upstream[`${GITHUB}/releases/latest`] = () => redirect(`${GITHUB}/releases/tag/v4.0.6`)
  release('v4.0.6', 'esp32.bin')
  await get(releases, '/releases/latest.json')
  await get(releases, '/releases/v4.0.6.json?flavor=verbose')
  assert.ok(fetched.length > 0)
  assert.ok(fetched.every(url => !url.includes('api.github.com')), fetched.join('\n'))
})

test('release manifest rejects encoded separators in the tag', async () => {
  assert.equal((await get(releases, '/releases/a%2F..%2F..%2Fb.json')).status, 400)
  assert.deepEqual(fetched, [])
})

test('release manifest rejects an unsafe flavor', async () => {
  assert.equal((await get(releases, '/releases/v4.0.6.json?flavor=..%2F..%2Fx')).status, 400)
  assert.deepEqual(fetched, [])
})

test('tagged download proxies the asset body', async () => {
  upstream[`${GITHUB}/releases/download/v4.0.6/esp32.bin`] = () => new Response(new Uint8Array([0xe9, 1, 2, 3]), { headers: { 'Content-Type': 'application/octet-stream' } })

  const res = await get(releases, '/releases/download/v4.0.6/esp32.bin')
  assert.equal(res.status, 200)
  assert.equal(res.headers.get('Content-Type'), 'application/octet-stream')
  assert.equal(res.headers.get('Cache-Control'), 'public, max-age=86400, stale-while-revalidate=86400, stale-if-error=86400')
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), '*')
  assert.deepEqual(new Uint8Array(await res.arrayBuffer()), new Uint8Array([0xe9, 1, 2, 3]))
})

test('tagged download caches the latest tag for 5 minutes', async () => {
  upstream[`${GITHUB}/releases/download/latest/esp32.bin`] = () => new Response('x')
  assert.equal((await get(releases, '/releases/download/latest/esp32.bin')).headers.get('Cache-Control'), 'public, max-age=300, stale-while-revalidate=86400, stale-if-error=86400')
})

test('tagged download returns 502 when GitHub fails', async () => {
  upstream[`${GITHUB}/releases/download/v4.0.6/esp32.bin`] = () => new Response('boom', { status: 500 })
  assert.equal((await get(releases, '/releases/download/v4.0.6/esp32.bin')).status, 502)
})

test('run manifest returns 502 for a malformed GitHub response', async () => {
  upstream[`${API}/actions/runs/123/artifacts`] = () => new Response('<html>oops</html>')
  assert.equal((await get(artifacts, '/artifacts/123.json')).status, 502)
})

test('tagged download returns 404 for a missing asset', async () => {
  assert.equal((await get(releases, '/releases/download/v4.0.6/nope.bin')).status, 404)
})

test('releases returns 404 for an unknown route', async () => {
  assert.equal((await get(releases, '/releases/nope')).status, 404)
  assert.deepEqual(fetched, [])
})

// --- artifacts ---------------------------------------------------------------

import * as fflate from 'fflate'

const NIGHTLY = 'https://nightly.link/ESPresense/ESPresense'
const runsUrl = (branch) => `${API}/actions/workflows/build.yml/runs?branch=${branch}&per_page=30`
const ok = (id) => ({ id, conclusion: 'success' })
const artifactList = (...names) => ({
  artifacts: names.map((name, id) => ({ id, name, workflow_run: { head_branch: 'main', head_sha: 'abcdef1234567890' } })),
})

test('latest artifact redirects to the newest successful run', async () => {
  upstream[runsUrl('main')] = () => json({ workflow_runs: [ok(222), ok(111)] })

  const res = await get(artifacts, '/artifacts/latest/download/main/esp32.bin')
  assert.equal(res.status, 302)
  assert.equal(res.headers.get('Location'), '/artifacts/download/runs/222/esp32.bin')
})

test('latest artifact accepts branch names with slashes', async () => {
  upstream[runsUrl('perf%2Fmedian-iqr-scratch')] = () => json({ workflow_runs: [ok(444)] })

  const res = await get(artifacts, '/artifacts/latest/download/perf/median-iqr-scratch/esp32.bin')
  assert.equal(res.status, 302)
  assert.equal(res.headers.get('Location'), '/artifacts/download/runs/444/esp32.bin')
})

test('latest artifact accepts deeply nested branch names', async () => {
  upstream[runsUrl('a%2Fb%2Fc')] = () => json({ workflow_runs: [ok(555)] })
  assert.equal((await get(artifacts, '/artifacts/latest/download/a/b/c/esp32c3-cdc.bin')).headers.get('Location'), '/artifacts/download/runs/555/esp32c3-cdc.bin')
})

test('latest artifact needs both a branch and a file', async () => {
  assert.equal((await get(artifacts, '/artifacts/latest/download/esp32.bin')).status, 404)
  assert.deepEqual(fetched, [])
})

test('latest artifact encodes the branch into the query string', async () => {
  upstream[runsUrl('perf%2Fscratch%26status%3Dfailure')] = () => json({ workflow_runs: [ok(333)] })

  const res = await get(artifacts, '/artifacts/latest/download/perf%2Fscratch%26status%3Dfailure/esp32.bin')
  assert.equal(res.headers.get('Location'), '/artifacts/download/runs/333/esp32.bin')
})

test('latest artifact returns 404 when the branch has no successful run', async () => {
  upstream[runsUrl('stale')] = () => json({ workflow_runs: [] })
  assert.equal((await get(artifacts, '/artifacts/latest/download/stale/esp32.bin')).status, 404)
})

test('latest artifact returns 502 when GitHub answers 429', async () => {
  upstream[runsUrl('main')] = () => json({ message: 'slow down' }, 429)
  assert.equal((await get(artifacts, '/artifacts/latest/download/main/esp32.bin')).status, 502)
})

test('latest artifact returns 502 when GitHub answers 403', async () => {
  upstream[runsUrl('main')] = () => json({ message: 'rate limit exceeded' }, 403)
  assert.equal((await get(artifacts, '/artifacts/latest/download/main/esp32.bin')).status, 502)
})

test('run artifact unzips and returns the firmware image', async () => {
  const image = new Uint8Array([0xe9, 9, 8, 7, 6])
  upstream[`${NIGHTLY}/actions/runs/123/esp32.bin.zip`] = () => new Response(fflate.zipSync({ 'esp32.bin': image }))

  const res = await get(artifacts, '/artifacts/download/runs/123/esp32.bin')
  assert.equal(res.status, 200)
  assert.equal(res.headers.get('Content-Type'), 'application/octet-stream')
  assert.deepEqual(new Uint8Array(await res.arrayBuffer()), image)
})

test('run artifact returns 404 when nightly.link has no such artifact', async () => {
  assert.equal((await get(artifacts, '/artifacts/download/runs/123/nope.bin')).status, 404)
})

test('run artifact returns 502 for a corrupt zip', async () => {
  upstream[`${NIGHTLY}/actions/runs/123/esp32.bin.zip`] = () => new Response('this is not a zip')
  assert.equal((await get(artifacts, '/artifacts/download/runs/123/esp32.bin')).status, 502)
})

test('run artifact returns 502 when nightly.link fails', async () => {
  upstream[`${NIGHTLY}/actions/runs/123/esp32.bin.zip`] = () => new Response('boom', { status: 500 })
  assert.equal((await get(artifacts, '/artifacts/download/runs/123/esp32.bin')).status, 502)
})

test('run artifact returns 404 for an empty zip', async () => {
  upstream[`${NIGHTLY}/actions/runs/123/esp32.bin.zip`] = () => new Response(fflate.zipSync({}))
  assert.equal((await get(artifacts, '/artifacts/download/runs/123/esp32.bin')).status, 404)
})

test('run manifest lists a build per chip family', async () => {
  upstream[`${API}/actions/runs/123/artifacts`] = () => json(artifactList('esp32.bin', 'esp32c3.bin', 'esp32c3-cdc.bin', 'esp32s3.bin', 'esp32s3-cdc.bin', 'esp32c6.bin', 'esp32c6-cdc.bin'))

  const res = await get(artifacts, '/artifacts/123.json')
  assert.equal(res.status, 200)
  const manifest = await res.json()
  assert.equal(manifest.name, 'ESPresense main branch')
  assert.equal(manifest.version, 'main-abcdef1')
  assert.deepEqual(appPaths(manifest), [
    'ESP32 download/runs/123/esp32.bin',
    'ESP32-C3:uart download/runs/123/esp32c3.bin',
    'ESP32-C3:cdc download/runs/123/esp32c3-cdc.bin',
    'ESP32-S3:uart download/runs/123/esp32s3.bin',
    'ESP32-S3:cdc download/runs/123/esp32s3-cdc.bin',
    'ESP32-C6:uart download/runs/123/esp32c6.bin',
    'ESP32-C6:cdc download/runs/123/esp32c6-cdc.bin',
  ])
})

test('run manifest prefers flavored artifacts', async () => {
  upstream[`${API}/actions/runs/123/artifacts`] = () => json(artifactList('esp32.bin', 'esp32-verbose.bin', 'esp32c3.bin'))

  const manifest = await (await get(artifacts, '/artifacts/123.json?flavor=verbose')).json()
  assert.equal(manifest.name, 'ESPresense main branch (verbose)')
  assert.deepEqual(appPaths(manifest), ['ESP32 download/runs/123/esp32-verbose.bin', 'ESP32-C3:uart download/runs/123/esp32c3.bin'])
})

test('run manifest returns 404 when the run has no artifacts', async () => {
  upstream[`${API}/actions/runs/123/artifacts`] = () => json({ artifacts: [] })
  assert.equal((await get(artifacts, '/artifacts/123.json')).status, 404)
})

test('run manifest passes through a GitHub 404', async () => {
  assert.equal((await get(artifacts, '/artifacts/999.json')).status, 404)
})

test('run manifest returns 502 when GitHub answers 403', async () => {
  upstream[`${API}/actions/runs/123/artifacts`] = () => json({ message: 'rate limit exceeded' }, 403)
  assert.equal((await get(artifacts, '/artifacts/123.json')).status, 502)
})

test('run manifest does not route a non-numeric run id', async () => {
  assert.equal((await get(artifacts, '/artifacts/main.json')).status, 404)
  assert.deepEqual(fetched, [])
})

for (const handler of [releases, artifacts]) {
  test(`${handler === releases ? 'releases' : 'artifacts'} allows cross-origin requests`, async () => {
    const path = handler === releases ? '/releases/download/v4.0.6/nope.bin' : '/artifacts/download/runs/123/nope.bin'
    assert.equal((await get(handler, path)).headers.get('Access-Control-Allow-Origin'), '*')
  })
}

// --- last good answer is served when GitHub fails ---------------------------

import { afterEach } from 'node:test'

// Minimal stand-in for the Workers Cache API
const edgeCache = () => {
  const entries = new Map()
  return {
    entries,
    match: async (req) => entries.get(req.url)?.clone(),
    put: async (req, res) => { entries.set(req.url, res.clone()) },
  }
}
const realNow = Date.now
afterEach(() => {
  delete globalThis.caches
  Date.now = realNow
})
const minutesLater = (n) => { const at = realNow() + n * 60_000; Date.now = () => at }
const send = (handler, path, method) => handler({
  request: new Request('https://espresense.com' + path, { method }),
  env: {}, params: {}, waitUntil() {}, passThroughOnException() {},
  next: () => new Response(null, { status: 404 }),
})

test('update check keeps answering from the last good redirect when GitHub fails', async () => {
  globalThis.caches = { default: edgeCache() }
  const tagged = `${GITHUB}/releases/download/v4.1.0b0/esp32c3.bin`
  upstream[`${GITHUB}/releases.atom`] = () => new Response(feed('v4.1.0b0'))
  upstream[tagged] = () => redirect('https://release-assets.example/signed')
  assert.equal((await send(releases, '/releases/latest-any/download/esp32c3.bin', 'HEAD')).status, 302)

  minutesLater(10)
  upstream[`${GITHUB}/releases.atom`] = () => new Response('slow down', { status: 429 })

  const res = await send(releases, '/releases/latest-any/download/esp32c3.bin', 'HEAD')
  assert.equal(res.status, 302)
  assert.equal(res.headers.get('Location'), tagged)
  assert.equal(res.headers.get('X-Release-Cache'), 'STALE')
  assert.equal(res.headers.get('Cache-Control'), 'no-store')
})

test('fresh answers are served without asking GitHub again', async () => {
  globalThis.caches = { default: edgeCache() }
  upstream[`${GITHUB}/releases.atom`] = () => new Response(feed('v4.1.0b0'))
  upstream[`${GITHUB}/releases/download/v4.1.0b0/esp32.bin`] = () => redirect('https://release-assets.example/signed')
  await get(releases, '/releases/latest-any/download/esp32.bin')
  const asked = fetched.length

  minutesLater(4)
  const res = await send(releases, '/releases/latest-any/download/esp32.bin', 'HEAD')
  assert.equal(res.status, 302)
  assert.equal(res.headers.get('Cache-Control'), 'public, max-age=300, stale-while-revalidate=86400, stale-if-error=86400')
  assert.equal(res.headers.get('X-Release-Cache'), 'HIT')
  assert.equal(res.headers.get('X-Stored-At'), null)
  assert.equal(fetched.length, asked)
})

test('a new release is picked up once the answer is no longer fresh', async () => {
  globalThis.caches = { default: edgeCache() }
  upstream[`${GITHUB}/releases.atom`] = () => new Response(feed('v4.1.0b0'))
  upstream[`${GITHUB}/releases/download/v4.1.0b0/esp32.bin`] = () => redirect('https://release-assets.example/a')
  await get(releases, '/releases/latest-any/download/esp32.bin')

  minutesLater(6)
  upstream[`${GITHUB}/releases.atom`] = () => new Response(feed('v4.2.0', 'v4.1.0b0'))
  upstream[`${GITHUB}/releases/download/v4.2.0/esp32.bin`] = () => redirect('https://release-assets.example/b')

  const res = await get(releases, '/releases/latest-any/download/esp32.bin')
  assert.equal(res.headers.get('Location'), `${GITHUB}/releases/download/v4.2.0/esp32.bin`)
})

test('manifest keeps answering from the last good copy when GitHub fails', async () => {
  globalThis.caches = { default: edgeCache() }
  upstream[`${GITHUB}/releases/latest`] = () => redirect(`${GITHUB}/releases/tag/v4.0.6`)
  release('v4.0.6', 'esp32.bin')
  const good = await (await get(releases, '/releases/latest.json')).json()

  minutesLater(10)
  upstream[`${GITHUB}/releases/latest`] = () => new Response('boom', { status: 503 })

  const res = await get(releases, '/releases/latest.json')
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), good)
})

test('run manifest falls back to the last good copy when the handler throws', async () => {
  globalThis.caches = { default: edgeCache() }
  upstream[`${API}/actions/runs/123/artifacts`] = () => json(artifactList('esp32.bin'))
  const good = await (await get(artifacts, '/artifacts/123.json')).json()

  minutesLater(60 * 25)
  upstream[`${API}/actions/runs/123/artifacts`] = () => new Response('<html>oops</html>')

  const res = await get(artifacts, '/artifacts/123.json')
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), good)
})

test('failures and missing files are never stored as the last good answer', async () => {
  const cache = edgeCache()
  globalThis.caches = { default: cache }
  upstream[`${GITHUB}/releases.atom`] = () => new Response('slow down', { status: 429 })
  assert.equal((await get(releases, '/releases/latest-any/download/esp32.bin')).status, 502)
  assert.equal((await get(releases, '/releases/download/v4.0.6/nope.bin')).status, 404)
  assert.equal((await get(releases, '/releases/latest/download/a%2F..%2Fb')).status, 400)
  assert.equal(cache.entries.size, 0)
})

test('tagged download serves the cached firmware image intact', async () => {
  globalThis.caches = { default: edgeCache() }
  const image = new Uint8Array([0xe9, 1, 2, 3])
  upstream[`${GITHUB}/releases/download/v4.0.6/esp32.bin`] = () => new Response(image, { headers: { 'Content-Type': 'application/octet-stream' } })
  assert.deepEqual(new Uint8Array(await (await get(releases, '/releases/download/v4.0.6/esp32.bin')).arrayBuffer()), image)

  upstream[`${GITHUB}/releases/download/v4.0.6/esp32.bin`] = () => new Response('boom', { status: 500 })
  const res = await get(releases, '/releases/download/v4.0.6/esp32.bin')
  assert.equal(res.status, 200)
  assert.deepEqual(new Uint8Array(await res.arrayBuffer()), image)
})

// --- GitHub token ------------------------------------------------------------

const withEnv = (handler, path, env) => handler({
  request: new Request('https://espresense.com' + path),
  env, params: {}, waitUntil() {}, passThroughOnException() {},
  next: () => new Response(null, { status: 404 }),
})

test('artifacts routes authenticate to the GitHub API when a token is configured', async () => {
  upstream[runsUrl('main')] = () => json({ workflow_runs: [ok(222)] })
  upstream[`${API}/actions/runs/123/artifacts`] = () => json(artifactList('esp32.bin'))
  await withEnv(artifacts, '/artifacts/latest/download/main/esp32.bin', { GITHUB_TOKEN: 'test-token' })
  await withEnv(artifacts, '/artifacts/123.json', { GITHUB_TOKEN: 'test-token' })

  assert.equal(sent.length, 2)
  for (const request of sent) assert.equal(request.headers.get('Authorization'), 'Bearer test-token')
})

test('artifacts routes work unauthenticated when no token is configured', async () => {
  upstream[`${API}/actions/runs/123/artifacts`] = () => json(artifactList('esp32.bin'))
  assert.equal((await get(artifacts, '/artifacts/123.json')).status, 200)
  assert.equal(sent[0].headers.get('Authorization'), null)
})

test('the token is only ever sent to the GitHub API', async () => {
  upstream[`${NIGHTLY}/actions/runs/123/esp32.bin.zip`] = () => new Response(fflate.zipSync({ 'esp32.bin': new Uint8Array([1]) }))
  await withEnv(artifacts, '/artifacts/download/runs/123/esp32.bin', { GITHUB_TOKEN: 'test-token' })
  assert.equal(sent[0].headers.get('Authorization'), null)
})

test('artifacts 502 reports what GitHub answered', async () => {
  upstream[`${API}/actions/runs/123/artifacts`] = () => json({ message: 'rate limit exceeded' }, 403)
  const res = await get(artifacts, '/artifacts/123.json')
  assert.equal(res.status, 502)
  assert.deepEqual((await res.json()).upstream, { status: 403 })
})

// --- GitHub answering wrongly or slowly -------------------------------------

test('latest artifact skips runs that did not succeed', async () => {
  upstream[runsUrl('main')] = () => json({ workflow_runs: [{ id: 999, conclusion: null }, { id: 888, conclusion: 'failure' }, ok(777), ok(666)] })
  assert.equal((await get(artifacts, '/artifacts/latest/download/main/esp32.bin')).headers.get('Location'), '/artifacts/download/runs/777/esp32.bin')
})

test('latest artifact returns 404 when no run on the branch succeeded', async () => {
  upstream[runsUrl('broken')] = () => json({ workflow_runs: [{ id: 999, conclusion: 'failure' }] })
  assert.equal((await get(artifacts, '/artifacts/latest/download/broken/esp32.bin')).status, 404)
})

const runPage = (runs, next) => {
  const response = json({ workflow_runs: runs })
  if (next) response.headers.set('Link', `<${next}>; rel="next"`)
  return response
}

test('latest artifact searches later pages and stops at the newest successful run', async () => {
  const url = runsUrl('perf%2Fscratch')
  const unsuccessful = Array.from({ length: 30 }, (_, i) => ({
    id: 999 - i, conclusion: ['failure', 'cancelled', null][i % 3],
  }))
  upstream[url] = () => runPage(unsuccessful, `${url}&page=2`)
  upstream[`${url}&page=2`] = () => runPage([ok(777), ok(666)], `${url}&page=3`)

  const res = await get(artifacts, '/artifacts/latest/download/perf/scratch/esp32.bin')
  assert.equal(res.status, 302)
  assert.equal(res.headers.get('Location'), '/artifacts/download/runs/777/esp32.bin')
  assert.deepEqual(fetched, [url, `${url}&page=2`])
})

test('latest artifact returns 404 only after exhausting the run pages', async () => {
  const url = runsUrl('main')
  upstream[url] = () => runPage([{ id: 999, conclusion: 'failure' }], `${url}&page=2`)
  upstream[`${url}&page=2`] = () => runPage([{ id: 888, conclusion: 'cancelled' }], `${url}&page=3`)
  upstream[`${url}&page=3`] = () => runPage([{ id: 777, conclusion: null }])

  assert.equal((await get(artifacts, '/artifacts/latest/download/main/esp32.bin')).status, 404)
  assert.deepEqual(fetched, [url, `${url}&page=2`, `${url}&page=3`])
})

test('a later run page failure is retried and reported as an upstream error', async () => {
  const url = runsUrl('main')
  upstream[url] = () => runPage([{ id: 999, conclusion: 'failure' }], `${url}&page=2`)
  upstream[`${url}&page=2`] = () => json({ message: 'slow down' }, 429)

  const res = await get(artifacts, '/artifacts/latest/download/main/esp32.bin')
  assert.equal(res.status, 502)
  assert.deepEqual((await res.json()).upstream, { status: 429 })
  assert.deepEqual(fetched, [url, `${url}&page=2`, `${url}&page=2`])
})

test('a later run page failure preserves the last good redirect', async () => {
  globalThis.caches = { default: edgeCache() }
  const url = runsUrl('main')
  upstream[url] = () => runPage([ok(777)])
  await get(artifacts, '/artifacts/latest/download/main/esp32.bin')

  minutesLater(10)
  upstream[url] = () => runPage([{ id: 999, conclusion: 'failure' }], `${url}&page=2`)
  upstream[`${url}&page=2`] = () => json({ message: 'slow down' }, 429)

  const res = await get(artifacts, '/artifacts/latest/download/main/esp32.bin')
  assert.equal(res.status, 302)
  assert.equal(res.headers.get('Location'), '/artifacts/download/runs/777/esp32.bin')
  assert.equal(res.headers.get('X-Release-Cache'), 'STALE')
})

test('latest artifact never goes back to an older run', async () => {
  globalThis.caches = { default: edgeCache() }
  upstream[runsUrl('main')] = () => json({ workflow_runs: [ok(35720887909), ok(35396273785)] })
  await get(artifacts, '/artifacts/latest/download/main/esp32.bin')

  minutesLater(10)
  // What GitHub was seen returning: an incomplete listing led by an old run
  upstream[runsUrl('main')] = () => json({ workflow_runs: [ok(34567205085), ok(31925656733)] })

  const res = await get(artifacts, '/artifacts/latest/download/main/esp32.bin')
  assert.equal(res.status, 302)
  assert.equal(res.headers.get('Location'), '/artifacts/download/runs/35720887909/esp32.bin')
  assert.equal(res.headers.get('X-Release-Cache'), 'STALE')
})

test('latest artifact keeps its answer when a branch with builds comes back empty', async () => {
  globalThis.caches = { default: edgeCache() }
  upstream[runsUrl('perf%2Fmedian-iqr-scratch')] = () => json({ workflow_runs: [ok(35387360096)] })
  await get(artifacts, '/artifacts/latest/download/perf/median-iqr-scratch/esp32.bin')

  minutesLater(10)
  upstream[runsUrl('perf%2Fmedian-iqr-scratch')] = () => json({ workflow_runs: [] })

  const res = await get(artifacts, '/artifacts/latest/download/perf/median-iqr-scratch/esp32.bin')
  assert.equal(res.status, 302)
  assert.equal(res.headers.get('Location'), '/artifacts/download/runs/35387360096/esp32.bin')
})

test('latest artifact moves forward to a newer run', async () => {
  globalThis.caches = { default: edgeCache() }
  upstream[runsUrl('main')] = () => json({ workflow_runs: [ok(100)] })
  await get(artifacts, '/artifacts/latest/download/main/esp32.bin')

  minutesLater(10)
  upstream[runsUrl('main')] = () => json({ workflow_runs: [ok(200), ok(100)] })
  assert.equal((await get(artifacts, '/artifacts/latest/download/main/esp32.bin')).headers.get('Location'), '/artifacts/download/runs/200/esp32.bin')
})

test('a refused lookup is retried once before failing', async () => {
  let calls = 0
  upstream[`${GITHUB}/releases.atom`] = () => (++calls === 1 ? new Response('slow down', { status: 429 }) : new Response(feed('v4.1.0b0')))
  upstream[`${GITHUB}/releases/download/v4.1.0b0/macchina-a0.bin`] = () => redirect('https://release-assets.example/signed')

  const res = await get(releases, '/releases/latest-any/download/macchina-a0.bin')
  assert.equal(res.status, 302)
  assert.equal(calls, 2)
})

test('a refused GitHub API call is retried once before failing', async () => {
  let calls = 0
  upstream[`${API}/actions/runs/123/artifacts`] = () => {
    calls++
    if (calls > 1) return json(artifactList('esp32.bin'))
    const response = json({ message: 'slow down' }, 403)
    response.headers.set('X-RateLimit-Remaining', '0')
    return response
  }
  assert.equal((await get(artifacts, '/artifacts/123.json')).status, 200)
  assert.equal(calls, 2)
})

test('a lookup that keeps failing is not retried forever', async () => {
  let calls = 0
  upstream[`${GITHUB}/releases.atom`] = () => { calls++; return new Response('boom', { status: 503 }) }
  assert.equal((await get(releases, '/releases/latest-any/download/esp32.bin')).status, 502)
  assert.equal(calls, 2)
})

for (const [name, handler, path, url, good] of [
  ['release', releases, '/releases/latest-any/download/esp32.bin', `${GITHUB}/releases.atom`, () => new Response(feed('v4.0.6'))],
  ['artifact', artifacts, '/artifacts/latest/download/main/esp32.bin', runsUrl('main'), () => json({ workflow_runs: [ok(777)] })],
]) {
  test(`${name} lookup recovers from a rejected first fetch`, async () => {
    upstream[`${GITHUB}/releases/download/v4.0.6/esp32.bin`] = () => redirect('https://release-assets.example/signed')
    let calls = 0
    upstream[url] = () => {
      if (++calls === 1) throw new TypeError('network failure')
      return good()
    }
    assert.equal((await get(handler, path)).status, 302)
    assert.equal(calls, 2)
  })

  test(`${name} lookup never attempts a third fetch`, async () => {
    for (const first of ['network', 503]) {
      let calls = 0
      upstream[url] = () => {
        calls++
        if (calls === 1 && first === 503) return new Response(null, { status: 503 })
        throw new TypeError('network failure')
      }
      assert.equal((await get(handler, path)).status, 502)
      assert.equal(calls, 2)
    }
  })

  test(`${name} lookup does not retry permanent client errors`, async () => {
    for (const status of [400, 401, 403, 404, 422]) {
      let calls = 0
      upstream[url] = () => { calls++; return new Response(null, { status }) }
      await get(handler, path)
      assert.equal(calls, 1, `HTTP ${status}`)
    }
  })

  test(`${name} lookup retries transient statuses and explicit rate limits once`, async () => {
    for (const [status, headers] of [
      [408, {}], [429, {}], [500, {}], [503, {}],
      [403, { 'X-RateLimit-Remaining': '0' }], [403, { 'Retry-After': '1' }],
    ]) {
      let calls = 0
      upstream[url] = () => { calls++; return new Response(null, { status, headers }) }
      assert.equal((await get(handler, path)).status, 502)
      assert.equal(calls, 2, `HTTP ${status} ${JSON.stringify(headers)}`)
    }
  })
}

test('errors and missing files do not invite the CDN to serve them stale', async () => {
  upstream[`${GITHUB}/releases.atom`] = () => new Response('boom', { status: 503 })
  for (const path of ['/releases/latest-any/download/esp32.bin', '/releases/download/v4.0.6/nope.bin', '/releases/v0.0.0.json']) {
    assert.ok(!(await get(releases, path)).headers.get('Cache-Control')?.includes('stale-'), path)
  }
})

// --- answers shared between edge locations ------------------------------------

// Minimal stand-in for a Workers KV namespace
const sharedStore = () => {
  const entries = new Map()
  const calls = { get: 0, put: 0 }
  return {
    entries, calls,
    get: async (key) => { calls.get++; const v = entries.get(key); return v === undefined ? null : JSON.parse(v) },
    put: async (key, value) => { calls.put++; entries.set(key, value) },
  }
}
// Each edge location has its own cache; all of them share one store
const location = (store) => {
  const cache = edgeCache()
  return (handler, path, method = 'GET') => {
    globalThis.caches = { default: cache }
    return handler({
      request: new Request('https://espresense.com' + path, { method }),
      env: { RELEASES: store }, params: {}, waitUntil() {}, passThroughOnException() {},
      next: () => new Response(null, { status: 404 }),
    })
  }
}
const githubHas = (tag, ...names) => {
  upstream[`${GITHUB}/releases.atom`] = () => new Response(feed(tag))
  release(tag, ...names)
}
const githubRefuses = () => {
  for (const url of Object.keys(upstream)) upstream[url] = () => new Response('slow down', { status: 429 })
  upstream[`${GITHUB}/releases.atom`] = () => new Response('slow down', { status: 429 })
}

test('a location with no answer of its own uses the one another location found', async () => {
  const store = sharedStore()
  const newark = location(store), atlanta = location(store)
  githubHas('v4.1.0b0', 'esp32c6-cdc.bin')
  assert.equal((await newark(releases, '/releases/latest-any/download/esp32c6-cdc.bin', 'HEAD')).status, 302)

  githubRefuses()
  const res = await atlanta(releases, '/releases/latest-any/download/esp32c6-cdc.bin', 'HEAD')
  assert.equal(res.status, 302)
  assert.equal(res.headers.get('Location'), `${GITHUB}/releases/download/v4.1.0b0/esp32c6-cdc.bin`)
  assert.equal(res.headers.get('X-Release-Cache'), 'STALE-GLOBAL')
  assert.equal(res.headers.get('Cache-Control'), 'no-store')
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), '*')
})

test('a manifest is shared between locations too', async () => {
  const store = sharedStore()
  const newark = location(store), atlanta = location(store)
  upstream[`${GITHUB}/releases/latest`] = () => redirect(`${GITHUB}/releases/tag/v4.0.6`)
  release('v4.0.6', 'esp32.bin', 'esp32c3.bin')
  const good = await (await newark(releases, '/releases/latest.json')).json()

  githubRefuses()
  upstream[`${GITHUB}/releases/latest`] = () => new Response('slow down', { status: 429 })
  const res = await atlanta(releases, '/releases/latest.json')
  assert.equal(res.status, 200)
  assert.match(res.headers.get('Content-Type'), /json/)
  assert.deepEqual(await res.json(), good)
})

test('a location prefers its own stored answer and leaves the shared store alone', async () => {
  const store = sharedStore()
  const newark = location(store)
  githubHas('v4.1.0b0', 'esp32.bin')
  await newark(releases, '/releases/latest-any/download/esp32.bin')
  const reads = store.calls.get

  minutesLater(10)
  githubRefuses()
  const res = await newark(releases, '/releases/latest-any/download/esp32.bin')
  assert.equal(res.headers.get('X-Release-Cache'), 'STALE')
  assert.equal(store.calls.get, reads)
})

test('an unchanged answer is not written again until the heartbeat is due', async () => {
  const store = sharedStore()
  const newark = location(store)
  githubHas('v4.1.0b0', 'esp32.bin')
  await newark(releases, '/releases/latest-any/download/esp32.bin')
  assert.equal(store.calls.put, 1)
  const reads = store.calls.get

  for (const minutes of [6, 12, 18, 60, 300]) {
    minutesLater(minutes)
    await newark(releases, '/releases/latest-any/download/esp32.bin')
  }
  assert.equal(store.calls.put, 1)
  assert.equal(store.calls.get, reads)

  minutesLater(6 * 60 + 5)
  await newark(releases, '/releases/latest-any/download/esp32.bin')
  assert.equal(store.calls.put, 2)
})

test('a second location finding the same answer does not write it again', async () => {
  const store = sharedStore()
  const newark = location(store), atlanta = location(store)
  githubHas('v4.1.0b0', 'esp32.bin')
  await newark(releases, '/releases/latest-any/download/esp32.bin')
  await atlanta(releases, '/releases/latest-any/download/esp32.bin')
  assert.equal(store.calls.put, 1)
})

test('a new release is written to the shared store', async () => {
  const store = sharedStore()
  const newark = location(store)
  githubHas('v4.1.0b0', 'esp32.bin')
  await newark(releases, '/releases/latest-any/download/esp32.bin')

  minutesLater(10)
  githubHas('v4.2.0', 'esp32.bin')
  await newark(releases, '/releases/latest-any/download/esp32.bin')
  assert.equal(store.calls.put, 2)
  assert.equal(JSON.parse(store.entries.get('response:/releases/latest-any/download/esp32.bin')).value.location, `${GITHUB}/releases/download/v4.2.0/esp32.bin`)
})

test('failures, missing files and firmware images are never written to the shared store', async () => {
  const store = sharedStore()
  const newark = location(store)
  upstream[`${GITHUB}/releases.atom`] = () => new Response('slow down', { status: 429 })
  assert.equal((await newark(releases, '/releases/latest-any/download/esp32.bin')).status, 502)
  assert.equal((await newark(releases, '/releases/download/v4.0.6/nope.bin')).status, 404)

  upstream[`${GITHUB}/releases/download/v4.0.6/esp32.bin`] = () => new Response(new Uint8Array([0xe9, 1, 2, 3]), { headers: { 'Content-Type': 'application/octet-stream' } })
  assert.equal((await newark(releases, '/releases/download/v4.0.6/esp32.bin')).status, 200)
  assert.equal(store.calls.put, 0)
})

test('a failing shared store never fails the request', async () => {
  const broken = { get: async () => { throw new Error('KV over quota') }, put: async () => { throw new Error('KV over quota') } }
  const newark = location(broken)
  githubHas('v4.1.0b0', 'esp32.bin')
  assert.equal((await newark(releases, '/releases/latest-any/download/esp32.bin')).status, 302)

  const atlanta = location(broken)
  githubRefuses()
  assert.equal((await atlanta(releases, '/releases/latest-any/download/esp32.bin')).status, 502)
})

test('a location new to a branch does not go back to an older run than another location served', async () => {
  const store = sharedStore()
  const newark = location(store), hongKong = location(store)
  upstream[runsUrl('main')] = () => json({ workflow_runs: [ok(35720887909)] })
  await newark(artifacts, '/artifacts/latest/download/main/esp32.bin')

  upstream[runsUrl('main')] = () => json({ workflow_runs: [ok(34567205085)] })
  const res = await hongKong(artifacts, '/artifacts/latest/download/main/esp32.bin')
  assert.equal(res.headers.get('Location'), '/artifacts/download/runs/35720887909/esp32.bin')
  assert.equal(res.headers.get('X-Release-Cache'), 'STALE-GLOBAL')
})

test('a location new to a branch keeps the shared answer when the branch comes back empty', async () => {
  const store = sharedStore()
  const newark = location(store), hongKong = location(store)
  upstream[runsUrl('perf%2Fmedian-iqr-scratch')] = () => json({ workflow_runs: [ok(35387360096)] })
  await newark(artifacts, '/artifacts/latest/download/perf/median-iqr-scratch/esp32.bin')

  upstream[runsUrl('perf%2Fmedian-iqr-scratch')] = () => json({ workflow_runs: [] })
  const res = await hongKong(artifacts, '/artifacts/latest/download/perf/median-iqr-scratch/esp32.bin')
  assert.equal(res.status, 302)
  assert.equal(res.headers.get('Location'), '/artifacts/download/runs/35387360096/esp32.bin')
})

test('a manifest only asks GitHub about files not already known for the release', async () => {
  const store = sharedStore()
  const newark = location(store), atlanta = location(store)
  release('v4.1.0b0', 'esp32.bin', 'esp32-verbose.bin', 'esp32c3.bin', 'esp32c3-cdc.bin', 'esp32s3.bin', 'esp32s3-cdc.bin', 'esp32c6.bin', 'esp32c6-cdc.bin')
  await newark(releases, '/releases/v4.1.0b0.json')
  assert.equal(fetched.length, 7)

  // Another location, another flavor: only the flavored candidates are new
  fetched.length = 0
  const manifest = await (await atlanta(releases, '/releases/v4.1.0b0.json?flavor=verbose')).json()
  assert.deepEqual(fetched.map(url => url.split('/').pop()).sort(), ['esp32-verbose.bin', 'esp32c3-verbose-cdc.bin', 'esp32c3-verbose.bin', 'esp32c6-verbose-cdc.bin', 'esp32c6-verbose.bin', 'esp32s3-verbose-cdc.bin', 'esp32s3-verbose.bin', 'verbose.bin'])
  assert.equal(appPaths(manifest)[0], 'ESP32 download/v4.1.0b0/esp32-verbose.bin')
  assert.equal(manifest.builds.length, 7)

  // Asked again somewhere new, nothing the release has needs asking about
  fetched.length = 0
  await location(store)(releases, '/releases/v4.1.0b0.json')
  assert.deepEqual(fetched, [])
})

test('a manifest is not built from partial answers', async () => {
  const store = sharedStore()
  const newark = location(store)
  release('v4.0.6', 'esp32.bin')
  upstream[`${GITHUB}/releases/download/v4.0.6/esp32c3.bin`] = () => new Response('slow down', { status: 429 })
  assert.equal((await newark(releases, '/releases/v4.0.6.json')).status, 502)
  assert.equal(store.entries.has('response:/releases/v4.0.6.json'), false)
})

test('a query string nobody uses cannot create shared records', async () => {
  const store = sharedStore()
  const newark = location(store)
  githubHas('v4.1.0b0', 'esp32.bin')
  for (const junk of ['a=1', 'a=2', 'b=3', 'utm_source=x']) {
    assert.equal((await newark(releases, `/releases/latest-any/download/esp32.bin?${junk}`)).status, 302)
  }
  assert.deepEqual([...store.entries.keys()], ['response:/releases/latest-any/download/esp32.bin'])
  assert.equal(store.calls.put, 1)
})

test('an invented flavor cannot create shared records', async () => {
  const store = sharedStore()
  const newark = location(store)
  release('v4.0.6', 'esp32.bin', 'esp32-verbose.bin')
  for (const flavor of ['nope1', 'nope2', 'nope3']) {
    const res = await newark(releases, `/releases/v4.0.6.json?flavor=${flavor}`)
    assert.equal(res.status, 200)
  }
  assert.deepEqual([...store.entries.keys()], ['assets:v4.0.6'])

  await newark(releases, '/releases/v4.0.6.json?flavor=verbose')
  assert.ok(store.entries.has('response:/releases/v4.0.6.json?flavor=verbose'))
})

test('run manifests and downloads are not shared', async () => {
  const store = sharedStore()
  const newark = location(store)
  upstream[`${API}/actions/runs/123/artifacts`] = () => json(artifactList('esp32.bin'))
  upstream[`${NIGHTLY}/actions/runs/123/esp32.bin.zip`] = () => new Response(fflate.zipSync({ 'esp32.bin': new Uint8Array([1]) }))
  assert.equal((await newark(artifacts, '/artifacts/123.json')).status, 200)
  assert.equal((await newark(artifacts, '/artifacts/download/runs/123/esp32.bin')).status, 200)
  assert.equal(store.calls.put, 0)
})

test('the marker for sharing never reaches the client', async () => {
  const newark = location(sharedStore())
  githubHas('v4.1.0b0', 'esp32.bin')
  const first = await newark(releases, '/releases/latest-any/download/esp32.bin')
  const hit = await newark(releases, '/releases/latest-any/download/esp32.bin')
  delete globalThis.caches
  const uncached = await get(releases, '/releases/latest-any/download/esp32.bin')
  for (const res of [first, hit, uncached]) {
    for (const header of ['X-Share', 'X-Stored-At', 'X-Global-At', 'X-Original-Cache-Control']) assert.equal(res.headers.get(header), null, header)
  }
})
