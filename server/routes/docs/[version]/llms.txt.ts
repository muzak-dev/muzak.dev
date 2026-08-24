// `/docs/<version>/llms.txt` - the llmstxt.org index of one documentation
// version, so that an agent asked about a release it is not running gets that
// release's pages rather than the newest ones.
//
// A Nitro route wins over the catch-all docs page, so this answers before the
// renderer ever sees the path.

import { isDocsVersion } from '#shared/docsVersions'

export default defineEventHandler(async (event) => {
  const version = getRouterParam(event, 'version') ?? ''
  if (!isDocsVersion(version)) {
    throw createError({ statusCode: 404, statusMessage: 'Unknown documentation version' })
  }
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return await buildLlmsIndex(version)
})
