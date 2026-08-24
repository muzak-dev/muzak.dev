// A sitemap generated from the docs content at build time, so it never goes
// stale. Prerendered (see nuxt.config `nitro.prerender.routes`).
//
// Every version's pages are listed, because an archived page is still a page a
// search should be able to reach. What separates them is priority: the current
// release ranks above the versions behind it, and each archived page also
// carries a canonical link to its successor (see the docs page component), so
// the newest URL is the one that accumulates the ranking.

import { DOCS_VERSIONS, LATEST_DOCS_VERSION } from '#shared/docsVersions'

export default defineEventHandler(async (event) => {
  const perVersion = await Promise.all(DOCS_VERSIONS.map((v) => collectDocs(v.version)))
  const docs = perVersion.flat()
  const lastmod = new Date().toISOString().slice(0, 10)

  const priorityOf = (doc: (typeof docs)[number]) => {
    if (doc.version !== LATEST_DOCS_VERSION) return '0.4'
    return doc.slug === 'introduction' ? '0.9' : '0.8'
  }

  const urls = [
    { loc: `${SITE_URL}/`, priority: '1.0' },
    { loc: `${SITE_URL}/docs`, priority: '0.7' },
    { loc: `${SITE_URL}/changelog`, priority: '0.6' },
    ...docs.map((doc) => ({ loc: doc.url, priority: priorityOf(doc) })),
  ]

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map(
        (url) =>
          `  <url><loc>${url.loc}</loc><changefreq>weekly</changefreq>` +
          `<priority>${url.priority}</priority><lastmod>${lastmod}</lastmod></url>`,
      )
      .join('\n') +
    '\n</urlset>\n'

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return body
})
