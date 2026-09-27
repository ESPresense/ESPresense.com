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
