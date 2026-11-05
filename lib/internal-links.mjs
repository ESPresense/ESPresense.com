// Cloudflare Pages serves each doc as a directory index, so /nodes 308s to /nodes/.
// Ahrefs counts every internal link that hits that redirect. These helpers emit the
// canonical trailing-slash URL, and send retired paths straight to their new home.

export const REDIRECTS = {
  '/beacons': '/devices/',
  '/beacons/android': '/android/',
  '/beacons/apple': '/apple/',
  '/beacons/other': '/other/',
  '/base-stations': '/nodes/',
  '/hardware': '/nodes/',
  '/install': '/firmware/',
  '/data-flow': '/troubleshooting/data-flow/',
  '/ids': '/troubleshooting/ids/',
  '/terminal': '/troubleshooting/terminal/',
  '/troubleshooting': '/troubleshooting/data-flow/',
  '/troubleshooting/rebooting': '/troubleshooting/reboot-loops/',
  '/integrations/home_assistant': '/integrations/home-assistant/',
};

const SITE_HOSTS = new Set(['espresense.com', 'www.espresense.com']);

function lookupPath(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

// Root-relative href for an espresense.com URL, or the original string when it
// points somewhere else (external, mailto, hash-only, protocol-relative).
export function normalizeInternalHref(href) {
  if (typeof href !== 'string' || href === '' || href.startsWith('#') || href.startsWith('//')) return href;
  if (/^(mailto:|javascript:|tel:)/i.test(href)) return href;

  let absolute;
  if (href.startsWith('/')) {
    absolute = new URL(href, 'https://espresense.com');
  } else {
    try {
      absolute = new URL(href);
    } catch {
      return href;
    }
    if (absolute.protocol !== 'http:' && absolute.protocol !== 'https:') return href;
    if (!SITE_HOSTS.has(absolute.hostname.toLowerCase())) return href;
  }

  const key = lookupPath(absolute.pathname);
  if (key === '/' || key === '') return `/${absolute.search}${absolute.hash}`;

  const mapped = REDIRECTS[key];
  if (mapped) {
    const dest = new URL(mapped, 'https://espresense.com');
    return `${dest.pathname}${absolute.search}${absolute.hash}`;
  }

  const last = key.slice(key.lastIndexOf('/') + 1);
  const path = last.includes('.') ? key : `${key}/`;
  return `${path}${absolute.search}${absolute.hash}`;
}

export function normalizeHtmlHrefs(html) {
  if (typeof html !== 'string') return html;
  return html.replace(/href=(["'])([^"']+)\1/g, (full, quote, href) => {
    const next = normalizeInternalHref(href);
    return next === href ? full : `href=${quote}${next}${quote}`;
  });
}

export function normalizeSidebar(items) {
  return items.map((item) => {
    const next = { ...item };
    if (typeof next.link === 'string') next.link = normalizeInternalHref(next.link);
    if (Array.isArray(next.items)) next.items = normalizeSidebar(next.items);
    return next;
  });
}

function walk(node, visit) {
  visit(node);
  if (!node?.children) return;
  for (const child of node.children) walk(child, visit);
}

export function rehypeNormalizeInternalLinks() {
  return (tree) => {
    walk(tree, (node) => {
      if (node?.type !== 'element' || node.tagName !== 'a') return;
      const href = node.properties?.href;
      if (typeof href !== 'string') return;
      const next = normalizeInternalHref(href);
      if (next !== href) node.properties.href = next;
    });
  };
}
