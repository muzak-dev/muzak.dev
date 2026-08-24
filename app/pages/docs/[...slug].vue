<script setup lang="ts">
import { LATEST_DOCS_VERSION, docsPath, splitDocsPath } from '#shared/docsVersions'

definePageMeta({
  layout: 'docs',
  // No entrance/exit animation when moving between docs.
  pageTransition: false,
  layoutTransition: false,
})

const route = useRoute()

// Which version this URL is inside. A path that names none is an unversioned
// link from before the docs were versioned, or from outside the site; it is
// answered with the newest version's copy of the same page. The redirect
// normally happens in Nitro, before this component runs, so that a crawler
// sees a real 302; this is the client-side half of the same rule, for a
// navigation that never reaches the server.
const { version: named, rest } = splitDocsPath(route.path)
if (!named) {
  await navigateTo(docsPath(LATEST_DOCS_VERSION, rest), { replace: true, redirectCode: 302 })
}
const version = computed(() => splitDocsPath(route.path).version ?? LATEST_DOCS_VERSION)
const isLatest = computed(() => version.value === LATEST_DOCS_VERSION)

// The current document, keyed by path so it refetches on navigation.
const { data: page } = await useAsyncData(`docs:${route.path}`, () =>
  queryCollection('docs').path(route.path).first(),
)

if (!page.value && named) {
  throw createError({ statusCode: 404, statusMessage: 'Doc not found', fatal: true })
}

// Previous / next, taken from this version's navigation rather than from the
// collection's own ordering: the collection holds every version, so its
// neighbours would run off the end of one version and into another.
const { data: nav } = await useDocsNav()
const leaves = computed(() => docLeaves(nav.value, version.value))
const position = computed(() => leaves.value.findIndex((leaf) => leaf.path === route.path))
const prev = computed(() => (position.value > 0 ? leaves.value[position.value - 1] : null))
const next = computed(() =>
  position.value >= 0 ? (leaves.value[position.value + 1] ?? null) : null,
)

// Where this page lives in the newest version, when it lives there at all.
// It is both the canonical URL for an archived page and where the notice at
// the top of one points.
const latestEquivalent = computed(() => {
  if (isLatest.value) {
    return null
  }
  const target = docsPath(LATEST_DOCS_VERSION, splitDocsPath(route.path).rest)
  const exists = docLeaves(nav.value, LATEST_DOCS_VERSION).some((leaf) => leaf.path === target)
  return exists ? target : null
})
const latestFallback = computed(
  () => latestEquivalent.value ?? firstDocLeaf(nav.value, LATEST_DOCS_VERSION) ?? '/docs',
)

// ── SEO ──
const site = 'https://muzak.dev'
// An archived page points search engines at the same page in the newest
// version when there is one, so that one URL accumulates the ranking and a
// reader arriving from a search lands on documentation that still describes
// the released framework. A page with no successor speaks for itself.
const canonical = computed(() => `${site}${latestEquivalent.value ?? route.path}`)
useSeoMeta({
  title: () => `${page.value?.title} · Muzak docs`,
  description: () => page.value?.description,
  ogType: 'article',
  ogTitle: () => `${page.value?.title} · Muzak docs`,
  ogDescription: () => page.value?.description,
  ogUrl: () => `${site}${route.path}`,
  twitterCard: 'summary_large_image',
  twitterTitle: () => `${page.value?.title} · Muzak docs`,
  twitterDescription: () => page.value?.description,
  robots: 'index, follow',
})
useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'canonical', href: () => canonical.value }],
})

// The social banner for this doc, generated from the Muzak OG template.
defineOgImageComponent('Muzak', {
  title: page.value?.title,
  description: page.value?.description,
})

// GEO: TechArticle structured data so engines can cite the doc cleanly.
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: page.value?.title,
          description: page.value?.description,
          url: `${site}${route.path}`,
          version: version.value,
          inLanguage: 'en',
          isPartOf: { '@type': 'WebSite', name: 'Muzak', url: site },
          author: { '@type': 'Organization', name: 'The Muzak project' },
        }),
      ),
    },
  ],
})
</script>

<template>
  <main class="min-w-0 py-10 md:px-9 lg:px-12">
    <!-- page actions (copy / open in …) -->
    <div class="mb-6 flex justify-end">
      <DocsPageActions :title="page?.title" />
    </div>

    <!-- reading an older version -->
    <div
      v-if="!isLatest"
      class="mb-8 border border-brass/40 bg-brass/5 px-4 py-3 text-[13px] text-ash"
    >
      You are reading the <span class="text-bone">{{ version }}</span> documentation.
      The current release is <span class="text-bone">{{ LATEST_DOCS_VERSION }}</span
      >.
      <NuxtLink :to="latestFallback" class="text-rust2 hover:underline">
        {{ latestEquivalent ? 'Read this page for it' : 'Go to the current docs' }} →
      </NuxtLink>
    </div>

    <!-- rendered markdown -->
    <article id="main-doc" class="prose-muzak">
      <ContentRenderer v-if="page" :value="page" />
    </article>

    <!-- prev / next -->
    <nav
      v-if="prev || next"
      class="mt-14 grid grid-cols-1 gap-3 border-t border-line pt-8 sm:grid-cols-2"
    >
      <NuxtLink
        v-if="prev"
        :to="prev.path"
        class="group border border-line bg-ink2 p-4 transition-colors hover:border-rust2"
      >
        <div class="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">← Previous</div>
        <div class="mt-1.5 text-[14px] text-ash transition-colors group-hover:text-bone">
          {{ prev.navTitle || prev.title }}
        </div>
      </NuxtLink>
      <span v-else />
      <NuxtLink
        v-if="next"
        :to="next.path"
        class="group border border-line bg-ink2 p-4 text-right transition-colors hover:border-rust2 sm:col-start-2"
      >
        <div class="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">Next →</div>
        <div class="mt-1.5 text-[14px] text-ash transition-colors group-hover:text-bone">
          {{ next.navTitle || next.title }}
        </div>
      </NuxtLink>
    </nav>

    <footer
      class="mt-10 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[11px] text-faint sm:flex-row sm:items-center sm:justify-between"
    >
      <span>Open source under MIT / Apache-2.0 · sustained by the people who ship on it.</span>
      <span>Built on net/http, and nothing else.</span>
    </footer>
  </main>
</template>
