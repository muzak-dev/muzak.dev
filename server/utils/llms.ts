// Builds the machine-readable documentation indexes (llmstxt.org) for one
// documentation version.
//
// Two routes serve each of them: `/llms.txt` and `/llms-full.txt` describe the
// current release, which is what the convention expects to find at the root of
// a site, and `/docs/<version>/llms.txt` and `/docs/<version>/llms-full.txt`
// describe one version each. Both go through here so the two can never drift
// into describing the same pages differently.

import { LATEST_DOCS_VERSION, docsPath } from '#shared/docsVersions'

const RULE = '-'.repeat(80)

/** The one-paragraph description of the framework, shared by both files. */
const BLURB =
  'Muzak is a type-safe web framework for Go, built on net/http and Go 1.27 ' +
  'with no third-party dependencies. A handler is an ordinary typed function: ' +
  'its input type is the request and its return type is the response body, ' +
  'both checked at compile time. Routing, request binding, validation, ' +
  'dependency injection, configuration, structured logging, WebSockets, ' +
  'server-sent events, rate limiting and OpenAPI 3.1 generation are part of ' +
  'the framework rather than separate modules. Install it with `go get muzak.dev/framework`.'

/** Where the companion files of a version live, as absolute URLs. */
function companions(version: string) {
  const base = `${SITE_URL}${docsPath(version)}`
  return {
    index: version === LATEST_DOCS_VERSION ? `${SITE_URL}/llms.txt` : `${base}/llms.txt`,
    full: version === LATEST_DOCS_VERSION ? `${SITE_URL}/llms-full.txt` : `${base}/llms-full.txt`,
    html: base,
  }
}

/**
 * States which version a file describes, and where the others are.
 *
 * A reader landing on the root file has no way to tell which release it covers
 * unless it says so, and an agent asked about an older release needs to know
 * that a file for it exists at all.
 */
function versionNote(version: string): string {
  const other = companions(version)
  return version === LATEST_DOCS_VERSION
    ? `This describes Muzak ${version}, the current release. Older versions are indexed under ${SITE_URL}/docs/<version>/llms.txt.`
    : `This describes Muzak ${version}, which is not the current release. The current documentation is at ${SITE_URL}/llms.txt, and this version's pages are at ${other.html}.`
}

/** The `llms.txt` index for one version. */
export async function buildLlmsIndex(version: string): Promise<string> {
  const docs = await collectDocs(version)
  const other = companions(version)

  const lines: string[] = [
    '# Muzak',
    '',
    `> ${BLURB}`,
    '',
    versionNote(version),
    '',
    'Every default is the conservative one: listener timeouts are non-zero, request ' +
      'bodies are capped, unknown JSON members are rejected, CORS denies every ' +
      'cross-origin request until a policy is written, a cross-origin WebSocket ' +
      'handshake is refused, no forwarding header is believed until a proxy is ' +
      'named, and a panic becomes a generic 500 with the stack recorded only in ' +
      'the log.',
    '',
    `The full text of every page is at ${other.full}.`,
    '',
  ]

  const groups = [...new Set(docs.map((doc) => doc.group))]
  for (const group of groups) {
    lines.push(`## ${groupLabel(group)}`, '')
    for (const doc of docs.filter((doc) => doc.group === group)) {
      const description = doc.description ? `: ${doc.description}` : ''
      lines.push(`- [${doc.title}](${doc.url})${description}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

/** The `llms-full.txt` corpus for one version. */
export async function buildLlmsFull(version: string): Promise<string> {
  const docs = await collectDocs(version)
  const other = companions(version)

  const header = [
    `# Muzak documentation (${version})`,
    '',
    'Muzak is a type-safe web framework for Go, built on net/http and Go 1.27 with',
    'no third-party dependencies. A handler is an ordinary typed function: its input',
    'type is the request and its return type is the response body, both checked at',
    'compile time. Install it with `go get muzak.dev/framework`.',
    '',
    versionNote(version),
    '',
    `The page index is at ${other.index}.`,
    `Every page below is also served as HTML under ${other.html}.`,
  ].join('\n')

  const blocks = docs.map((doc) => {
    const front = [
      RULE,
      `title: ${JSON.stringify(doc.title)}`,
      `description: ${JSON.stringify(doc.description)}`,
      `version: ${JSON.stringify(doc.version)}`,
      `last_updated: ${JSON.stringify(doc.lastModified)}`,
      `source: ${JSON.stringify(doc.url)}`,
      RULE,
    ].join('\n')
    return `${front}\n\n${doc.body}`
  })

  return `${header}\n\n\n${blocks.join('\n\n\n')}\n`
}
