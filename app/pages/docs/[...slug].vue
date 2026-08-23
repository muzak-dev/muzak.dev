<script setup lang="ts">
definePageMeta({
  layout: 'docs',
  // No entrance/exit animation when moving between docs.
  pageTransition: false,
  layoutTransition: false,
})

const route = useRoute()

// The current document, keyed by path so it refetches on navigation.
const { data: page } = await useAsyncData(`docs:${route.path}`, () =>
  queryCollection('docs').path(route.path).first(),
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Doc not found', fatal: true })
}

// Previous / next within the docs order.
const { data: surround } = await useAsyncData(`docs-surround:${route.path}`, () =>
  queryCollectionItemSurroundings('docs', route.path, {
    fields: ['title', 'description', 'navTitle', 'path'],
  }),
)
const prev = computed(() => surround.value?.[0] ?? null)
const next = computed(() => surround.value?.[1] ?? null)

// ── SEO ──
const site = 'https://muzak.dev'
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
  link: [{ rel: 'canonical', href: () => `${site}${route.path}` }],
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
