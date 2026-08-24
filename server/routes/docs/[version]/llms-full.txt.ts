// `/docs/<version>/llms-full.txt` - the full text of one documentation
// version, the companion to that version's `llms.txt`.

import { isDocsVersion } from '#shared/docsVersions'

export default defineEventHandler(async (event) => {
  const version = getRouterParam(event, 'version') ?? ''
  if (!isDocsVersion(version)) {
    throw createError({ statusCode: 404, statusMessage: 'Unknown documentation version' })
  }
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return await buildLlmsFull(version)
})
