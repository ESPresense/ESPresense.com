// Route tests for the Pages Functions, with GitHub stubbed out.
import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { onRequest as releases } from '../functions/releases/[[path]].ts'
import { onRequest as artifacts } from '../functions/artifacts/[[path]].ts'

const GITHUB = 'https://github.com/ESPresense/ESPresense'
const feed = (...tags) => tags.map(t => `<link rel="alternate" href="${GITHUB}/releases/tag/${t}"/>`).join('\n')
const redirect = (location) => new Response(null, { status: 302, headers: { Location: location } })

let upstream, fetched
beforeEach(() => {
  upstream = {}
  fetched = []
  globalThis.fetch = async (url) => {
    fetched.push(String(url))
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
  assert.equal(res.headers.get('Cache-Control'), 'public, max-age=300')
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
  assert.equal(res.headers.get('Cache-Control'), 'public, max-age=86400')
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
  assert.equal(res.headers.get('Cache-Control'), 'public, max-age=300')
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
  assert.equal(res.headers.get('Cache-Control'), 'public, max-age=86400')
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), '*')
  assert.deepEqual(new Uint8Array(await res.arrayBuffer()), new Uint8Array([0xe9, 1, 2, 3]))
})

test('tagged download caches the latest tag for 5 minutes', async () => {
  upstream[`${GITHUB}/releases/download/latest/esp32.bin`] = () => new Response('x')
  assert.equal((await get(releases, '/releases/download/latest/esp32.bin')).headers.get('Cache-Control'), 'public, max-age=300')
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
const runsUrl = (branch) => `${API}/actions/workflows/build.yml/runs?status=success&branch=${branch}`
const artifactList = (...names) => ({
  artifacts: names.map((name, id) => ({ id, name, workflow_run: { head_branch: 'main', head_sha: 'abcdef1234567890' } })),
})

test('latest artifact redirects to the newest successful run', async () => {
  upstream[runsUrl('main')] = () => json({ workflow_runs: [{ id: 222 }, { id: 111 }] })

  const res = await get(artifacts, '/artifacts/latest/download/main/esp32.bin')
  assert.equal(res.status, 302)
  assert.equal(res.headers.get('Location'), '/artifacts/download/runs/222/esp32.bin')
})

test('latest artifact accepts branch names with slashes', async () => {
  upstream[runsUrl('perf%2Fmedian-iqr-scratch')] = () => json({ workflow_runs: [{ id: 444 }] })

  const res = await get(artifacts, '/artifacts/latest/download/perf/median-iqr-scratch/esp32.bin')
  assert.equal(res.status, 302)
  assert.equal(res.headers.get('Location'), '/artifacts/download/runs/444/esp32.bin')
})

test('latest artifact accepts deeply nested branch names', async () => {
  upstream[runsUrl('a%2Fb%2Fc')] = () => json({ workflow_runs: [{ id: 555 }] })
  assert.equal((await get(artifacts, '/artifacts/latest/download/a/b/c/esp32c3-cdc.bin')).headers.get('Location'), '/artifacts/download/runs/555/esp32c3-cdc.bin')
})

test('latest artifact needs both a branch and a file', async () => {
  assert.equal((await get(artifacts, '/artifacts/latest/download/esp32.bin')).status, 404)
  assert.deepEqual(fetched, [])
})

test('latest artifact encodes the branch into the query string', async () => {
  upstream[runsUrl('perf%2Fscratch%26status%3Dfailure')] = () => json({ workflow_runs: [{ id: 333 }] })

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
