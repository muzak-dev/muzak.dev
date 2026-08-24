// Vanity import path support for the Go modules published under muzak.dev.
//
// A module's path is `muzak.dev/framework` or `muzak.dev/openapi`, but the code
// lives on GitHub. That indirection only works because the go command asks this
// site where to look: `go get muzak.dev/framework/validate` fetches
// https://muzak.dev/framework/validate?go-get=1 and reads a `go-import` meta
// tag out of the HTML. Without this handler the module paths resolve to
// nothing and every `go get` fails.
//
// Go walks the path upwards, so a request for a subpackage that 404s would
// still find the tag at the module root. Answering every path beneath a module
// directly saves that extra round trip and keeps the behaviour obvious.
//
// The second tag, `go-source`, is what gives pkg.go.dev working "source" links
// on every symbol it documents.

const BRANCH = 'main'

/** The modules this site publishes, by the first path segment they live under. */
const MODULES: Record<string, { module: string, repo: string }> = {
  framework: {
    module: 'muzak.dev/framework',
    repo: 'https://github.com/muzak-dev/framework',
  },
  // The OpenAPI dashboard, imported as muzak.dev/openapi/ui by an application
  // that wants a documentation page. It is a module of its own so that a
  // service which does not want one downloads none of it.
  openapi: {
    module: 'muzak.dev/openapi',
    repo: 'https://github.com/muzak-dev/openapi',
  },
}

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const first = url.pathname.split('/')[1] ?? ''
  const target = MODULES[first]
  if (!target) {
    return
  }

  // A person following the link wants the documentation, not a meta tag.
  if (url.searchParams.get('go-get') !== '1') {
    return sendRedirect(event, '/docs', 302)
  }

  const { module, repo } = target
  setHeader(event, 'content-type', 'text/html; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=300')
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="go-import" content="${module} git ${repo}">
<meta name="go-source" content="${module} ${repo} ${repo}/tree/${BRANCH}{/dir} ${repo}/blob/${BRANCH}{/dir}/{file}#L{line}">
<meta http-equiv="refresh" content="0; url=/docs">
</head>
<body>
Redirecting to <a href="/docs">the Muzak documentation</a>.
</body>
</html>
`
})
