// Runs the real release handlers against live github.com: node --no-warnings tools/release-redirect-check.mjs
import assert from 'node:assert'
import { onRequest } from '../functions/releases/[[path]].ts'
const get = (p) => onRequest({ request: new Request('https://espresense.com' + p, { redirect: 'manual' }), env: {}, params: {}, waitUntil() {}, passThroughOnException() {}, next: () => new Response('next', { status: 404 }) })
const tagged = /^https:\/\/github\.com\/ESPresense\/ESPresense\/releases\/download\/[^/]+\/esp32\.bin$/
for (const route of ['latest', 'latest-any']) {
  const ok = await get(`/releases/${route}/download/esp32.bin`)
  console.log(route, ok.status, ok.headers.get('Location'))
  assert.equal(ok.status, 302)
  assert.match(ok.headers.get('Location'), tagged)
  assert.equal((await get(`/releases/${route}/download/nope-not-real.bin`)).status, 404)
  assert.equal((await get(`/releases/${route}/download/a%2F..%2Fb`)).status, 400)
}
console.log('ok')
