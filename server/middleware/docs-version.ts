// Sends every unversioned documentation request to the current release.
//
// The docs live at `/docs/<version>/...`, but the links that reach this site
// mostly do not know that: the pages were unversioned until 0.1.1, the README
// and the framework's own error messages point at bare paths, and the content
// itself is authored with unversioned links. All of them keep working, because
// `/docs/techniques/json` is answered with a redirect to the newest version's
// copy of that page.
//
// The redirect is 302 and not 301: the target moves with every release, and a
// permanent redirect is one a browser stops asking about. Named versions are
// left alone, which is what keeps `/docs/0.2.7/...` and the per-version
// `llms.txt` routes reachable.
//
// This runs after `docs-markdown` (Nitro orders middleware by filename), so a
// versioned `.md` request is already answered by then, and an unversioned one
// arrives here to be redirected like any other path.

import {
  LATEST_DOCS_VERSION,
  docsPath,
  looksLikeDocsVersion,
  splitDocsPath,
} from '#shared/docsVersions'

export default defineEventHandler((event) => {
  const [path = '', query = ''] = splitQuery(event.path)
  if (path !== '/docs' && !path.startsWith('/docs/')) {
    return
  }

  const { version, rest } = splitDocsPath(path)
  if (version) {
    return // already inside a version
  }
  if (!rest) {
    return // bare /docs, resolved to the first page by the page component
  }

  // A path asking for a version that was never published is a miss, not an
  // unversioned link: redirecting it would bury `9.9.9` inside the newest
  // version and 404 there, blaming the page rather than the version.
  if (looksLikeDocsVersion(rest.split('/')[0])) {
    throw createError({ statusCode: 404, statusMessage: 'Unknown documentation version' })
  }

  return sendRedirect(event, docsPath(LATEST_DOCS_VERSION, rest) + query, 302)
})

/** Splits a request path into the path and its query string, if any. */
function splitQuery(target: string): [string, string] {
  const index = target.indexOf('?')
  if (index < 0) {
    return [target, '']
  }
  return [target.slice(0, index), target.slice(index)]
}
