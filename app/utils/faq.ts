// Shared FAQ source, rendered visibly in FaqSection and emitted as
// FAQPage JSON-LD on the homepage. Keeping one source keeps the structured
// data and the on-page answers identical, which is what GEO / AI engines
// reward when citing the page.
export interface FaqItem {
  q: string
  a: string
}

export const FAQ: FaqItem[] = [
  {
    q: 'What is Muzak?',
    a: 'Muzak is a type-safe web framework for Go, built on net/http and Go 1.27 with no third-party dependencies at all. A handler is an ordinary typed function: its input type is the request and its return type is the response body, and both are checked when you compile rather than when a request arrives.',
  },
  {
    q: 'How is a route registered?',
    a: 'With a generic method on a router: r.Get("/users/{username}", handler). Go 1.27 added generic methods and generalized function type inference, so the router reads the input and output types off the handler literal and you never write the type arguments yourself.',
  },
  {
    q: 'How does Muzak know where request data comes from?',
    a: 'From struct tags on the input type. A field tagged path, query, header, cookie, form or file is read from that part of the request; a field with no location tag is a member of the JSON body. The binding plan is compiled once per route at start-up, so the per-request path walks a list of precompiled setters and never inspects a type.',
  },
  {
    q: 'How does validation work?',
    a: 'An input model implements Validate(v *muzak.Validation) and declares rules against the field itself, as in v.String(&in.Email).Trim().Lower().Required().Email(). There is no tag string to typo and no field name written as text, so renaming a field is a change the compiler checks. The same declarations produce the constraints in the generated OpenAPI document.',
  },
  {
    q: 'Does Muzak generate API documentation?',
    a: 'Yes. An OpenAPI 3.1 document is served at /openapi.json and a self-contained documentation page at /docs, both derived from the routes, the input and output types and the validation rules. The page is embedded in the binary, fetches nothing from a third party, and runs under a strict content security policy.',
  },
  {
    q: 'Does it support WebSockets and server-sent events?',
    a: 'Both, with the protocols implemented in the framework rather than delegated. A WebSocket handshake is an ordinary GET, so middleware, guards, dependencies and input binding all run before a single byte is upgraded. An event stream is typed, so the compiler enforces what a route may send and the generated document describes it.',
  },
  {
    q: 'How fast is it?',
    a: 'On an Apple M1 Pro, matching a static route takes about 64 nanoseconds and allocates nothing, and a full request through the framework runs in about 546 nanoseconds, which is faster than a bare net/http ServeMux handler doing the same work by hand at about 608 nanoseconds. Numbers differ by machine; the benchmarks are reproducible with go test -bench.',
  },
  {
    q: 'What are the defaults?',
    a: 'Conservative ones. Every listener timeout is non-zero, request bodies are capped at one mebibyte, unknown JSON members are rejected, CORS denies every cross-origin request until a policy is written, a cross-origin WebSocket handshake is refused, no forwarding header is believed until a proxy is named, and a panic becomes a generic 500 with the stack recorded only in the log. Each can be relaxed deliberately; none is relaxed by omission.',
  },
  {
    q: 'What does Muzak require?',
    a: 'Go 1.27. The framework uses generic methods, generalized function type inference, encoding/json/v2 and the standard library uuid package, none of which exist in earlier versions. It has no third-party dependencies.',
  },
]
