import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  REDIRECTS,
  normalizeInternalHref,
  normalizeHtmlHrefs,
  normalizeSidebar,
  rehypeNormalizeInternalLinks,
} from '../lib/internal-links.mjs';

test('directory links gain the trailing slash Cloudflare already canonicalizes', () => {
  assert.equal(normalizeInternalHref('/nodes'), '/nodes/');
  assert.equal(normalizeInternalHref('/nodes/'), '/nodes/');
  assert.equal(normalizeInternalHref('/nodes#boards'), '/nodes/#boards');
  assert.equal(normalizeInternalHref('/nodes/#boards'), '/nodes/#boards');
  assert.equal(normalizeInternalHref('/firmware?beta=1'), '/firmware/?beta=1');
  assert.equal(normalizeInternalHref('/'), '/');
  assert.equal(normalizeInternalHref('https://espresense.com/devices'), '/devices/');
  assert.equal(normalizeInternalHref('https://www.espresense.com/apple/'), '/apple/');
  assert.equal(normalizeInternalHref('http://espresense.com/credits'), '/credits/');
});

test('files, hashes, and off-site links stay put', () => {
  assert.equal(normalizeInternalHref('/favicon.svg'), '/favicon.svg');
  assert.equal(normalizeInternalHref('/sitemap-index.xml'), '/sitemap-index.xml');
  assert.equal(normalizeInternalHref('/images/cover.png'), '/images/cover.png');
  assert.equal(normalizeInternalHref('#local'), '#local');
  assert.equal(normalizeInternalHref('mailto:hi@example.com'), 'mailto:hi@example.com');
  assert.equal(normalizeInternalHref('//cdn.example.com/app.js'), '//cdn.example.com/app.js');
  assert.equal(
    normalizeInternalHref('https://github.com/ESPresense/ESPresense'),
    'https://github.com/ESPresense/ESPresense',
  );
});

test('retired paths skip the redirect chain and land on the canonical URL', () => {
  assert.equal(normalizeInternalHref('/terminal'), '/troubleshooting/terminal/');
  assert.equal(normalizeInternalHref('/terminal/'), '/troubleshooting/terminal/');
  assert.equal(normalizeInternalHref('/troubleshooting'), '/troubleshooting/data-flow/');
  assert.equal(normalizeInternalHref('https://espresense.com/terminal'), '/troubleshooting/terminal/');
  assert.equal(normalizeInternalHref('/beacons/apple#watch'), '/apple/#watch');
  assert.equal(normalizeInternalHref('/integrations/home_assistant/'), '/integrations/home-assistant/');
});

test('frontmatter HTML and the sidebar use the same rules', () => {
  assert.equal(
    normalizeHtmlHrefs('<a href="/firmware">Browser installer</a>'),
    '<a href="/firmware/">Browser installer</a>',
  );
  assert.deepEqual(
    normalizeSidebar([
      { label: 'Home', link: '/' },
      { label: 'Boards', items: [{ label: 'Athom', link: '/nodes/athom-pg03v3' }] },
      { slug: 'firmware' },
    ]),
    [
      { label: 'Home', link: '/' },
      { label: 'Boards', items: [{ label: 'Athom', link: '/nodes/athom-pg03v3/' }] },
      { slug: 'firmware' },
    ],
  );
});

test('rehype rewrites anchors in the markdown tree before external-link handling', () => {
  const tree = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'a',
        properties: { href: '/configuration/mqtt' },
        children: [{ type: 'text', value: 'MQTT' }],
      },
      {
        type: 'element',
        tagName: 'a',
        properties: { href: 'https://espresense.com/terminal' },
        children: [{ type: 'text', value: 'terminal' }],
      },
    ],
  };
  rehypeNormalizeInternalLinks()(tree);
  assert.equal(tree.children[0].properties.href, '/configuration/mqtt/');
  assert.equal(tree.children[1].properties.href, '/troubleshooting/terminal/');
});

test('Cloudflare _redirects covers every retired path, with and without a slash', () => {
  const rules = new Map();
  for (const line of readFileSync(new URL('../public/_redirects', import.meta.url), 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [from, to, code] = trimmed.split(/\s+/);
    rules.set(from, { to, code });
  }
  for (const [from, to] of Object.entries(REDIRECTS)) {
    for (const src of [from, `${from}/`]) {
      assert.deepEqual(rules.get(src), { to, code: '301' }, src);
    }
  }
  assert.equal(rules.get('/sitemap.xml')?.to, '/sitemap-index.xml');
  assert.equal(rules.get('/sitemap.xml')?.code, '301');
});

test('robots.txt tells crawlers where the sitemap is', () => {
  const robots = readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8');
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Sitemap: https:\/\/espresense\.com\/sitemap-index\.xml$/m);
});
