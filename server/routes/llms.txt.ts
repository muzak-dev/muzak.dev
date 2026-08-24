// `/llms.txt` - an index of the documentation for AI / generative engines,
// in the llmstxt.org format (https://llmstxt.org). The full text lives at
// `/llms-full.txt`. Generated from the docs content, prerendered.
//
// The root file describes the current release, which is what a crawler looking
// for one expects at the root of a site. Each version also publishes its own at
// `/docs/<version>/llms.txt`.

import { LATEST_DOCS_VERSION } from '#shared/docsVersions'

export default defineEventHandler(async (event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return await buildLlmsIndex(LATEST_DOCS_VERSION)
})
