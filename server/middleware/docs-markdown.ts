// Serves the raw Markdown source of a doc at `<doc-url>.md`, e.g.
// `/docs/framework/getting-started/introduction.md`.
//
// This is middleware rather than a route so it can match only the `.md` suffix
// and let every other request (the HTML doc pages) fall through untouched.
// Returning a value short-circuits the request; returning nothing passes it on.

export default defineEventHandler(async (event) => {
  const path = event.path.split('?')[0] ?? ''
  if (!path.startsWith('/docs/') || !path.endsWith('.md')) {
    return // not a Markdown request, let the page renderer handle it
  }

  const docPath = path.replace(/\.md$/, '')
  const docs = await collectDocs()
  const doc = docs.find((entry) => entry.path === docPath)
  if (!doc) {
    return // unknown doc, fall through to the normal 404 page
  }

  setHeader(event, 'content-type', 'text/markdown; charset=utf-8')
  return doc.body
})
