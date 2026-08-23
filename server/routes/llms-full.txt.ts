// `/llms-full.txt` - the full text of every documentation page as one Markdown
// file, for AI / generative engines. Sits next to `/llms.txt`. Generated from
// the docs content, prerendered.
//
// Each page is preceded by a metadata block (title, description, last_updated,
// source) fenced by an 80-character rule, the same shape Vercel uses. The file
// opens with a short header so an engine reading this alone knows what Muzak
// is without having to infer it from the first page.

const RULE = '-'.repeat(80)

export default defineEventHandler(async (event) => {
  const docs = await collectDocs()

  const header = [
    '# Muzak documentation',
    '',
    'Muzak is a type-safe web framework for Go, built on net/http and Go 1.27 with',
    'no third-party dependencies. A handler is an ordinary typed function: its input',
    'type is the request and its return type is the response body, both checked at',
    'compile time. Install it with `go get muzak.dev/framework`.',
    '',
    `The page index is at ${SITE_URL}/llms.txt.`,
    `Every page below is also served as HTML under ${SITE_URL}/docs.`,
  ].join('\n')

  const blocks = docs.map((doc) => {
    const front = [
      RULE,
      `title: ${JSON.stringify(doc.title)}`,
      `description: ${JSON.stringify(doc.description)}`,
      `last_updated: ${JSON.stringify(doc.lastModified)}`,
      `source: ${JSON.stringify(doc.url)}`,
      RULE,
    ].join('\n')
    return `${front}\n\n${doc.body}`
  })

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `${header}\n\n\n${blocks.join('\n\n\n')}\n`
})
