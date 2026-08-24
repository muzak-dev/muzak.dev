// `/llms-full.txt` - the full text of every documentation page as one Markdown
// file, for AI / generative engines. Sits next to `/llms.txt`. Generated from
// the docs content, prerendered.
//
// Each page is preceded by a metadata block (title, description, version,
// last_updated, source) fenced by an 80-character rule, the same shape Vercel
// uses. The file opens with a short header so an engine reading this alone
// knows what Muzak is without having to infer it from the first page.
//
// The root file carries the current release; `/docs/<version>/llms-full.txt`
// carries one version each.

import { LATEST_DOCS_VERSION } from '#shared/docsVersions'

export default defineEventHandler(async (event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return await buildLlmsFull(LATEST_DOCS_VERSION)
})
