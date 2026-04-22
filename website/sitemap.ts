/**
 * Sitemap generator for the SSR server.
 *
 * Derives the public site URL from VITE_STRAPI_URL by stripping the `api.`
 * subdomain (e.g. https://api.drobinnaawiaka.com → https://drobinnaawiaka.com).
 * Fetches all published blog posts from Strapi and combines them with the
 * static page list. Result is cached in memory for CACHE_TTL_MS.
 */

const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

let cache: { xml: string; builtAt: number } | null = null

// ── URL helpers ───────────────────────────────────────────────────────────────

export function getStrapiUrl(): string {
  return process.env.VITE_STRAPI_URL || process.env.STRAPI_URL || 'http://localhost:1337'
}

export function getSiteUrl(): string {
  const raw = getStrapiUrl()
  try {
    const u = new URL(raw)
    if (u.hostname.startsWith('api.')) {
      return `${u.protocol}//${u.hostname.slice(4)}`
    }
    // Dev fallback — frontend runs on PORT (default 3000)
    const port = process.env.PORT || '3000'
    return `http://localhost:${port}`
  } catch {
    return 'https://drobinnaawiaka.com'
  }
}

// ── Static pages ──────────────────────────────────────────────────────────────

interface PageEntry {
  loc: string
  lastmod: string
  changefreq: string
  priority: string
}

function staticPages(today: string): PageEntry[] {
  return [
    { loc: '/',        changefreq: 'daily',   priority: '1.0', lastmod: today },
    { loc: '/about',   changefreq: 'monthly', priority: '0.9', lastmod: today },
    { loc: '/services',changefreq: 'weekly',  priority: '0.8', lastmod: today },
    { loc: '/blog',    changefreq: 'daily',   priority: '0.8', lastmod: today },
    { loc: '/shop',    changefreq: 'weekly',  priority: '0.7', lastmod: today },
    { loc: '/booking', changefreq: 'monthly', priority: '0.7', lastmod: today },
    { loc: '/contact', changefreq: 'monthly', priority: '0.6', lastmod: today },
  ]
}

// ── Strapi fetch (server-side only, reads process.env directly) ───────────────

async function fetchPublishedPosts(): Promise<Array<{ slug: string; updatedAt: string }>> {
  const url =
    `${getStrapiUrl()}/api/blog-posts` +
    `?fields[0]=slug&fields[1]=updatedAt&fields[2]=publishedAt` +
    `&pagination[pageSize]=200&sort=publishedAt:desc`
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`Strapi ${res.status}`)
  const json = await res.json() as { data: Array<{ slug: string; updatedAt: string }> }
  return json.data ?? []
}

// ── XML builder ───────────────────────────────────────────────────────────────

function buildXml(siteUrl: string, pages: PageEntry[]): string {
  const urls = pages
    .map(
      (p) =>
        `  <url>\n` +
        `    <loc>${siteUrl}${p.loc}</loc>\n` +
        `    <lastmod>${p.lastmod}</lastmod>\n` +
        `    <changefreq>${p.changefreq}</changefreq>\n` +
        `    <priority>${p.priority}</priority>\n` +
        `  </url>`,
    )
    .join('\n')
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls +
    `\n</urlset>`
  )
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Invalidate the in-memory cache so the next request rebuilds the sitemap. */
export function invalidateSitemapCache(): void {
  cache = null
}

/** Return the sitemap XML, rebuilding from Strapi if the cache has expired. */
export async function generateSitemap(): Promise<string> {
  if (cache && Date.now() - cache.builtAt < CACHE_TTL_MS) {
    return cache.xml
  }

  const siteUrl = getSiteUrl()
  const today = new Date().toISOString().slice(0, 10)

  let blogPages: PageEntry[] = []
  try {
    const posts = await fetchPublishedPosts()
    blogPages = posts.map((p) => ({
      loc: `/blog/${p.slug}`,
      lastmod: p.updatedAt ? p.updatedAt.slice(0, 10) : today,
      changefreq: 'monthly',
      priority: '0.7',
    }))
  } catch {
    // Strapi unavailable — skip dynamic pages, serve static-only sitemap
  }

  const xml = buildXml(siteUrl, [...staticPages(today), ...blogPages])
  cache = { xml, builtAt: Date.now() }
  return xml
}
