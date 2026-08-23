// Vanity import path support for `muzak.dev/framework`.
//
// The framework's module path is `muzak.dev/framework`, but the code lives on
// GitHub. That indirection only works because the go command asks this site
// where to look: `go get muzak.dev/framework/validate` fetches
// https://muzak.dev/framework/validate?go-get=1 and reads a `go-import` meta
// tag out of the HTML. Without this handler the module path resolves to
// nothing and every `go get` fails.
//
// Go walks the path upwards, so a request for a subpackage that 404s would
// still find the tag at `/framework`. Answering every `/framework/**` path
// directly saves that extra round trip and keeps the behaviour obvious.
//
// The second tag, `go-source`, is what gives pkg.go.dev working "source" links
// on every symbol it documents.

const MODULE = 'muzak.dev/framework'
const REPO = 'https://github.com/muzak-dev/framework'
const BRANCH = 'main'

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  if (url.pathname !== '/framework' && !url.pathname.startsWith('/framework/')) {
    return
  }

  // A person following the link wants the documentation, not a meta tag.
  if (url.searchParams.get('go-get') !== '1') {
    return sendRedirect(event, '/docs', 302)
  }

  setHeader(event, 'content-type', 'text/html; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=300')
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="go-import" content="${MODULE} git ${REPO}">
<meta name="go-source" content="${MODULE} ${REPO} ${REPO}/tree/${BRANCH}{/dir} ${REPO}/blob/${BRANCH}{/dir}/{file}#L{line}">
<meta http-equiv="refresh" content="0; url=/docs">
</head>
<body>
Redirecting to <a href="/docs">the Muzak documentation</a>.
</body>
</html>
`
})
