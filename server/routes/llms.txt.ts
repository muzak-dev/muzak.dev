// `/llms.txt` - an index of the documentation for AI / generative engines,
// in the llmstxt.org format (https://llmstxt.org). The full text lives at
// `/llms-full.txt`. Generated from the docs content, prerendered.

export default defineEventHandler(async (event) => {
  const docs = await collectDocs()

  const lines: string[] = [
    '# Muzak',
    '',
    '> Muzak is a type-safe web framework for Go, built on net/http and Go 1.27 ' +
      'with no third-party dependencies. A handler is an ordinary typed function: ' +
      'its input type is the request and its return type is the response body, ' +
      'both checked at compile time. Routing, request binding, validation, ' +
      'dependency injection, configuration, structured logging, WebSockets, ' +
      'server-sent events, rate limiting and OpenAPI 3.1 generation are part of ' +
      'the framework rather than separate modules. Install it with `go get muzak.dev/framework`.',
    '',
    'Every default is the conservative one: listener timeouts are non-zero, request ' +
      'bodies are capped, unknown JSON members are rejected, CORS denies every ' +
      'cross-origin request until a policy is written, a cross-origin WebSocket ' +
      'handshake is refused, no forwarding header is believed until a proxy is ' +
      'named, and a panic becomes a generic 500 with the stack recorded only in ' +
      'the log.',
    '',
    `The full text of every page is at ${SITE_URL}/llms-full.txt.`,
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

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return lines.join('\n')
})
