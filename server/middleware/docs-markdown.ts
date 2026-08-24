// Serves the raw Markdown source of a doc at `<doc-url>.md`, e.g.
// `/docs/0.1.1/getting-started/introduction.md`.
//
// This is middleware rather than a route so it can match only the `.md` suffix
// and let every other request (the HTML doc pages) fall through untouched.
// Returning a value short-circuits the request; returning nothing passes it on.
//
// The version in the path decides which tree is read. An unversioned `.md`
// request falls through to the redirect middleware, which sends it to the
// current release's copy rather than guessing here.

import { splitDocsPath } from '#shared/docsVersions'

export default defineEventHandler(async (event) => {
  const path = event.path.split('?')[0] ?? ''
  if (!path.startsWith('/docs/') || !path.endsWith('.md')) {
    return // not a Markdown request, let the page renderer handle it
  }

  const docPath = path.replace(/\.md$/, '')
  const { version } = splitDocsPath(docPath)
  if (!version) {
    return // unversioned, the redirect middleware answers it
  }

  const docs = await collectDocs(version)
  const doc = docs.find((entry) => entry.path === docPath)
  if (!doc) {
    return // unknown doc, fall through to the normal 404 page
  }

  setHeader(event, 'content-type', 'text/markdown; charset=utf-8')
  return doc.body
})
