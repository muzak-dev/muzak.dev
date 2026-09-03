// Terminal playback scripts for the Muzak demos.
// Each step is one printed line: a typed command (`cmd`), a plain output
// line (`out` + optional colour `cls`), or a rich line (`html`). `d` is the
// pause in ms after the line before the next one plays.
//
// Every line here is output the framework actually produces: the start-up and
// shutdown logs are the console handler's real format, and the JSON bodies are
// the real response and error envelopes.
export interface TermStep {
  cmd?: string
  out?: string
  html?: string
  cls?: string
  d?: number
}

export const TERMINAL_SCRIPTS: Record<string, TermStep[]> = {
  install: [
    { cmd: 'go get muzak.dev/framework' },
    { out: 'go: downloading muzak.dev/framework v0.2.7', cls: 'c-faint', d: 280 },
    { out: 'go: added muzak.dev/framework v0.2.7', cls: 'c-ash', d: 240 },
    { html: '<span class="c-patina">✓</span> <span class="c-ash">no third party dependencies</span>', d: 200 },
    { cmd: 'go run ./cmd' },
    { html: '<span class="c-faint">14:32:07.482</span> <span class="c-bone">INFO</span>  <span class="c-brass">[Server]</span> Starting Muzak application...', d: 220 },
    { html: '<span class="c-faint">14:32:07.514</span> <span class="c-bone">INFO</span>  <span class="c-brass">[Server]</span> Listening on :8080', cls: 'c-patina', d: 120 },
  ],
  get: [
    { cmd: 'go version' },
    { out: 'go version go1.27.0 darwin/arm64', cls: 'c-bone', d: 160 },
    { cmd: 'go get muzak.dev/framework' },
    { html: '<span class="c-patina">✓</span> <span class="c-ash">added</span> <span class="c-bone">muzak.dev/framework v0.2.7</span>', d: 120 },
  ],
  layout: [
    { cmd: 'tree -L 2 awesome-api' },
    { html: '<span class="c-bone">awesome-api/</span>', d: 160 },
    { html: '  <span class="c-faint">├─</span> cmd/main.go      <span class="c-faint">composition</span>', cls: 'c-ash', d: 90 },
    { html: '  <span class="c-faint">├─</span> core/            <span class="c-faint">config, dependencies</span>', cls: 'c-ash', d: 90 },
    { html: '  <span class="c-faint">├─</span> schemas/         <span class="c-faint">request and response models</span>', cls: 'c-ash', d: 90 },
    { html: '  <span class="c-faint">├─</span> handlers/        <span class="c-faint">the functions that answer</span>', cls: 'c-ash', d: 90 },
    { html: '  <span class="c-faint">└─</span> routers/         <span class="c-faint">which handler answers which path</span>', cls: 'c-ash', d: 140 },
    { html: '<span class="c-patina">✓</span> <span class="c-faint">dependencies point one way</span>', d: 120 },
  ],
  m1: [
    { cmd: 'go run ./cmd' },
    { html: '<span class="c-brass">[Server]</span> <span class="c-ash">Starting 2 components in parallel</span>', d: 300 },
    { html: '<span class="c-patina">✓</span> <span class="c-ash">Listening on</span> <span class="c-bone">:8080</span>', d: 120 },
  ],
  m2: [
    { cmd: "curl localhost:8080/users/rick" },
    { html: '<span class="c-bone">{</span><span class="c-brass">"username"</span><span class="c-bone">:</span><span class="c-patina">"rick"</span><span class="c-bone">}</span>', d: 220 },
    { html: '<span class="c-faint">200 · the handler\'s return type, encoded</span>', d: 120 },
  ],
  m3: [
    { cmd: "curl 'localhost:8080/users/?limit=nope'" },
    { html: '<span class="c-rust">422</span> <span class="c-brass">"limit"</span> <span class="c-ash">must be a valid integer</span>', d: 300 },
    { html: '<span class="c-faint">every offending field, reported at once</span>', d: 120 },
  ],
  m4: [
    { cmd: 'curl -s localhost:8080/openapi.json | head -3' },
    { html: '<span class="c-bone">{</span> <span class="c-brass">"openapi"</span><span class="c-bone">:</span> <span class="c-patina">"3.1.0"</span><span class="c-bone">,</span>', d: 200 },
    { html: '  <span class="c-brass">"info"</span><span class="c-bone">:</span> <span class="c-bone">{</span> <span class="c-brass">"title"</span><span class="c-bone">:</span> <span class="c-patina">"Awesome API"</span>', d: 120 },
  ],
  m5: [
    { cmd: '^C' },
    { html: '<span class="c-brass">[Server]</span> <span class="c-ash">Shutting down, waiting for in-flight requests...</span>', d: 340 },
    { html: '<span class="c-patina">✓</span> <span class="c-ash">Stopped</span> <span class="c-faint">(drained, then released)</span>', d: 120 },
  ],
}

// Order used to cascade the lifecycle cards as they scroll in.
export const LIFECYCLE_ORDER: Record<string, number> = {
  m1: 0,
  m2: 1,
  m3: 2,
  m4: 3,
  m5: 4,
}
