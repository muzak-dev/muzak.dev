<script setup lang="ts">
import type { NuxtError } from '#app'

// The site's error page. Nuxt renders this outside the normal layout, so it
// carries its own header rather than reusing the landing one, whose nav is a
// list of anchors that only resolve on the home page.
//
// The panel below renders the failure as the error envelope the framework
// itself would have written. It is the same shape a Muzak service returns for
// any unsuccessful request, which makes the 404 a small demonstration of the
// thing being documented rather than a dead end.
const props = defineProps<{ error: NuxtError }>()

const route = useRoute()

const status = computed(() => props.error?.statusCode ?? 500)

/** The path that failed, as the server saw it. */
const path = computed(() => {
  const url = props.error?.url
  if (typeof url === 'string' && url) {
    try {
      return new URL(url, 'http://placeholder').pathname
    } catch {
      return url
    }
  }
  return route.fullPath
})

/**
 * The machine-readable classifier, mirroring the framework's CodeForStatus:
 * a recognised status gets a specific code, any other 4xx becomes client_error
 * and everything else internal_error.
 */
const code = computed(() => {
  switch (status.value) {
    case 400: return 'bad_request'
    case 401: return 'unauthorized'
    case 403: return 'forbidden'
    case 404: return 'not_found'
    case 405: return 'method_not_allowed'
    case 409: return 'conflict'
    case 413: return 'payload_too_large'
    case 415: return 'unsupported_media_type'
    case 422: return 'validation_error'
    case 429: return 'too_many_requests'
    default: return status.value >= 400 && status.value < 500 ? 'client_error' : 'internal_error'
  }
})

/** Phrased the way the framework phrases its own, which reads as a sentence. */
const message = computed(() =>
  status.value === 404
    ? `no route matches GET ${path.value}`
    : props.error?.statusMessage || 'The server could not complete the request.',
)

const heading = computed(() =>
  status.value === 404 ? 'No route matches this path.' : 'Something went wrong.',
)

const explanation = computed(() =>
  status.value === 404
    ? 'The page you asked for is not here. It may have moved, or the link that brought you here may be out of date.'
    : 'The page could not be rendered. Trying again may be enough; if it is not, the link below goes somewhere that works.',
)

// The envelope, laid out the way the framework serialises it.
const envelope = computed(() =>
  [
    '{',
    '  "error": {',
    `    "code": "${code.value}",`,
    `    "message": "${message.value}",`,
    `    "status": ${status.value}`,
    '  }',
    '}',
  ].join('\n'),
)

useSeoMeta({
  title: () => `${status.value} · Muzak`,
  robots: 'noindex, follow',
})
</script>

<template>
  <div class="relative min-h-screen bg-ink text-bone">
    <div class="grid-bg pointer-events-none absolute inset-0" />

    <header class="relative px-4 sm:px-6 pt-6">
      <div class="mx-auto max-w-[1200px]">
        <NuxtLink to="/" class="inline-flex items-center gap-2" aria-label="Muzak home">
          <img
            src="/logo.png"
            alt=""
            width="26"
            height="26"
            class="h-[26px] w-[26px] shrink-0 object-contain"
          >
          <span class="font-mono text-[14px] font-semibold tracking-tight">muzak</span>
        </NuxtLink>
      </div>
    </header>

    <main class="relative mx-auto flex max-w-[1200px] flex-col px-4 sm:px-6 pt-16 pb-24 md:pt-24">
      <!-- Same eyebrow the hero uses: a flex row with a gap, rather than a
           margin on an inline-block that has to be nudged onto the baseline. -->
      <p
        class="rise inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-rust"
        style="animation-delay: 0.05s"
      >
        <span class="h-px w-6 bg-rust2" /> Error
      </p>

      <h1
        class="rise mt-5 font-mono text-[clamp(4rem,14vw,9rem)] font-semibold leading-[0.85] tracking-[-0.04em]"
        style="animation-delay: 0.1s"
      >
        {{ status }}
      </h1>

      <p
        class="rise mt-6 text-[clamp(1.3rem,2.6vw,1.9rem)] font-semibold tracking-[-0.02em]"
        style="animation-delay: 0.16s"
      >
        {{ heading }}
      </p>

      <p
        class="rise mt-4 max-w-lg text-[14.5px] leading-relaxed text-ash"
        style="animation-delay: 0.22s"
      >
        {{ explanation }}
      </p>

      <!-- the failure, as the framework would have answered it -->
      <div class="rise mt-9 max-w-2xl" style="animation-delay: 0.28s">
        <div class="overflow-hidden border border-line bg-ink2">
          <div
            class="flex shrink-0 items-center justify-between border-b border-line bg-ink3 px-3.5 py-2 font-mono text-[11px]"
          >
            <div class="flex items-center gap-2 text-ash">
              <span class="h-2 w-2 rounded-full bg-rust2/80" />
              <span class="h-2 w-2 rounded-full bg-line2" />
              <span class="h-2 w-2 rounded-full bg-line2" />
              <span class="ml-2">response</span>
            </div>
            <span class="text-faint">application/json</span>
          </div>
          <pre class="thin overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-[1.7] text-ash"><code>{{ envelope }}</code></pre>
        </div>
        <p class="mt-3 pl-1 font-mono text-[11px] text-faint">
          The same envelope a Muzak service returns for any request it cannot answer.
        </p>
      </div>

      <div class="rise mt-9 flex flex-wrap items-center gap-3" style="animation-delay: 0.34s">
        <NuxtLink
          to="/"
          class="bg-rust px-4 py-2.5 font-mono text-[12px] font-semibold text-ink transition-colors hover:bg-[#f06436]"
          @click="clearError({ redirect: '/' })"
        >
          Back home
        </NuxtLink>
        <NuxtLink
          to="/docs"
          class="border border-line2 px-4 py-2.5 font-mono text-[12px] text-ash transition-colors hover:border-rust2 hover:text-bone"
          @click="clearError({ redirect: '/docs' })"
        >
          Read the docs
        </NuxtLink>
      </div>
    </main>
  </div>
</template>
